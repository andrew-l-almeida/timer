import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  const [time, setTime] = useState(new Date())
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timerLeft, setTimerLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)



  const colorScheme = useColorScheme();


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => new Date(prevTime.getTime() + 1000))
      if (isRunning && !isPaused) {
        setTimerLeft(timeLeft => timeLeft - 1)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const startTimer = () => {
    setTime(new Date())
    const totalTime = (parseInt(hours.toString()) * 3600) + (parseInt(minutes.toString()) * 60) + parseInt(seconds.toString());
    setTimerLeft(totalTime)
    setIsRunning(true)
    setIsPaused(false)
  }

  const formatTime = (totalSeconds: number) => {
    const isNegative = totalSeconds < 0;
    const absSeconds = Math.abs(totalSeconds)
    const hrs = Math.floor(absSeconds / 3600)
    const mins = Math.floor((absSeconds % 3600) / 60)
    const secs = absSeconds % 60;
    return `${isNegative ? '-' : ''}${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.clockContainer}>
          <Text style={styles.clockText}>
            {time.toLocaleTimeString()}
          </Text>
        </View>
        <View>
          {!isRunning && (
            <>
              <View style={styles.timerInputContainer}>
                <TextInput style={styles.timerNumbers} mode='outlined' label='Horas' keyboardType='numeric' onChangeText={text => setHours(Number(text))} value={hours.toString().padStart(2, '0')} />
                <Text style={styles.twoDots}>:</Text>
                <TextInput style={styles.timerNumbers} mode='outlined' label='Minutos' keyboardType='numeric' onChangeText={text => setMinutes(Number(text))} value={minutes.toString().padStart(2, '0')} />
                <Text style={styles.twoDots}>:</Text>
                <TextInput style={styles.timerNumbers} mode='outlined' label='Segundos' keyboardType='numeric' onChangeText={text => setSeconds(Number(text))} value={seconds.toString().padStart(2, '0')} />
              </View>
              <Button style={styles.startButton} onPress={startTimer} mode='contained'>Iniciar</Button>
            </>
          )}

          {isRunning && timerLeft !== null && <Text style={[styles.timerText, timerLeft < 0 ? { color: '#F44336' } : { color: '#4CAF50' }]}>{formatTime(timerLeft)}</Text>}
          {isRunning && timerLeft !== null && (
            <View style={styles.buttonContainer}>
              <Button style={isPaused ? styles.startButton : styles.pauseButton} textColor='white' mode='contained-tonal' onPress={() => {
                setIsPaused(prev => !prev)
                setTime(new Date())
              }}>{isPaused ? 'Retomar' : 'Pausar'}</Button>
              <Button style={styles.stopButton} textColor={'white'} mode='contained-tonal' onPress={() => {
                setIsRunning(false)
                setTime(new Date())
              }}>Parar</Button>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  clockContainer: {
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#333',
  },
  timerInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    alignItems: 'center',
  },
  timerNumbers: {
    fontSize: 30,
    width: 80,
  },
  twoDots: {
    fontSize: 50,
    color: '#333',
  },
  timerText: {
    textAlign: 'center',
    fontSize: 80,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 10,
  },
  pauseButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 10,
    color: 'white'
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
    padding: 10,
    borderRadius: 10,
  },
});
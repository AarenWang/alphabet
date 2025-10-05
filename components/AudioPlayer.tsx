'use client'

import { Button } from "@/components/ui/button"
import { Play, Volume2 } from "lucide-react"
import { useRef, useState } from "react"

interface AudioPlayerProps {
  src: string
  label?: string
  className?: string
}

export function AudioPlayer({ src, label, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          setIsPlaying(false)
        } else {
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="default"
        size="sm"
        onClick={handlePlay}
        className={`flex items-center gap-1 transition-all duration-200 ${
          isPlaying 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isPlaying ? <Volume2 className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        {label || '播放'}
      </Button>
      <audio
        ref={audioRef}
        src={src}
        onEnded={handleEnded}
        preload="none"
      />
    </div>
  )
}

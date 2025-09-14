import { useState, useRef, useEffect } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Download,
  List,
  Repeat,
  Shuffle,
  Clock
} from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  duration?: number;
  cover?: string;
}

interface AudioPlayerProps {
  track?: AudioTrack;
  playlist?: AudioTrack[];
  onTrackChange?: (trackId: string) => void;
  className?: string;
}

export function AudioPlayer({ track, playlist = [], onTrackChange, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    // Update audio source
    audio.src = track.url;
    audio.volume = volume;
    audio.playbackRate = playbackSpeed;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [track]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = value[0];
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    const newVolume = value[0];
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    setPlaybackSpeed(nextSpeed);
    
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handlePrevious = () => {
    if (!playlist.length || !track) return;
    
    const currentIndex = playlist.findIndex(t => t.id === track.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    const prevTrack = playlist[prevIndex];
    
    if (prevTrack) {
      onTrackChange?.(prevTrack.id);
    }
  };

  const handleNext = () => {
    if (!playlist.length || !track) return;
    
    const currentIndex = playlist.findIndex(t => t.id === track.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    if (nextTrack) {
      onTrackChange?.(nextTrack.id);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return (
      <LiquidGlassCard className={`p-6 ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">No Audio Selected</h3>
            <p className="text-sm text-muted-foreground">
              Choose an audio track to start listening
            </p>
          </div>
        </div>
      </LiquidGlassCard>
    );
  }

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      
      <LiquidGlassCard className={`p-6 ${className}`}>
        <div className="space-y-6">
          {/* Track Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold">{track.title}</h3>
            {track.subtitle && (
              <p className="text-sm text-muted-foreground">{track.subtitle}</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration}
              step={1}
              className="w-full"
              disabled={!duration}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handlePrevious}
              disabled={playlist.length <= 1}
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <LiquidGlassButton 
              onClick={handlePlayPause}
              disabled={isLoading}
              className="w-12 h-12 rounded-full"
            >
              {isLoading ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </LiquidGlassButton>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleNext}
              disabled={playlist.length <= 1}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeedChange}
                className="text-xs px-2"
              >
                {playbackSpeed}x
              </Button>
              
              <Button variant="ghost" size="sm">
                <Clock className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button variant="outline" size="sm">
              <List className="w-4 h-4 mr-2" />
              Playlist
            </Button>
          </div>
        </div>
      </LiquidGlassCard>
    </>
  );
}
import { useState, useEffect, useRef } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Download, Heart, Share2, Clock, BookOpen, Headphones 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioTrack {
  id: string;
  title: string;
  book: string;
  chapter: number;
  narrator: string;
  duration: number;
  url: string;
  premium: boolean;
}

export function EnhancedAudioPlayer() {
  const [tracks] = useState<AudioTrack[]>([
    {
      id: '1',
      title: 'Matthew Chapter 5 - The Sermon on the Mount',
      book: 'Matthew',
      chapter: 5,
      narrator: 'David Platt',
      duration: 720, // 12 minutes
      url: '/audio/matthew-5.mp3',
      premium: false
    },
    {
      id: '2',
      title: 'John Chapter 3 - Born Again',
      book: 'John',
      chapter: 3,
      narrator: 'Sarah Johnson',
      duration: 840, // 14 minutes
      url: '/audio/john-3.mp3',
      premium: false
    },
    {
      id: '3',
      title: 'Psalm 23 - The Lord is My Shepherd',
      book: 'Psalms',
      chapter: 23,
      narrator: 'Timothy Keller',
      duration: 300, // 5 minutes
      url: '/audio/psalm-23.mp3',
      premium: true
    }
  ]);

  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0');
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = parseFloat(playbackSpeed);
    }
  }, [playbackSpeed]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setLoading(true);
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleTrackSelect = (track: AudioTrack) => {
    if (track.premium) {
      toast({
        title: "Premium Content",
        description: "This audio requires a premium subscription.",
        variant: "destructive"
      });
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    handleTrackSelect(tracks[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    handleTrackSelect(tracks[nextIndex]);
  };

  const handleDownload = (track: AudioTrack) => {
    if (track.premium) {
      toast({
        title: "Premium Feature",
        description: "Downloads require a premium subscription.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Download Started",
      description: `Downloading ${track.title}...`
    });
  };

  const handleFavorite = (track: AudioTrack) => {
    toast({
      title: "Added to Favorites",
      description: `${track.title} has been saved to your favorites.`
    });
  };

  const handleShare = (track: AudioTrack) => {
    navigator.clipboard.writeText(`Listen to ${track.title} on Bible App`);
    toast({
      title: "Link Copied",
      description: "Audio link copied to clipboard!"
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Headphones className="w-6 h-6" />
          Audio Bible
        </h1>
        <p className="text-muted-foreground">
          Listen to Scripture with professional narration
        </p>
      </div>

      {/* Audio Player */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Now Playing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentTrack && (
            <>
              {/* Track Info */}
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
                <p className="text-muted-foreground">Narrated by {currentTrack.narrator}</p>
                {currentTrack.premium && (
                  <Badge variant="secondary" className="bg-gradient-primary text-white">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <LiquidGlassButton
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                >
                  <SkipBack className="w-4 h-4" />
                </LiquidGlassButton>

                <LiquidGlassButton
                  size="lg"
                  onClick={handlePlayPause}
                  disabled={loading}
                  className="w-12 h-12 rounded-full"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </LiquidGlassButton>

                <LiquidGlassButton
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                >
                  <SkipForward className="w-4 h-4" />
                </LiquidGlassButton>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center justify-between">
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <LiquidGlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </LiquidGlassButton>
                  <Slider
                    value={volume}
                    max={1}
                    step={0.1}
                    onValueChange={setVolume}
                    className="w-20"
                  />
                </div>

                {/* Speed Control */}
                <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1.0">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2.0">2x</SelectItem>
                  </SelectContent>
                </Select>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <LiquidGlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavorite(currentTrack)}
                  >
                    <Heart className="w-4 h-4" />
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(currentTrack)}
                  >
                    <Download className="w-4 h-4" />
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(currentTrack)}
                  >
                    <Share2 className="w-4 h-4" />
                  </LiquidGlassButton>
                </div>
              </div>
            </>
          )}

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={currentTrack?.url}
            preload="metadata"
          />
        </CardContent>
      </LiquidGlassCard>

      {/* Track List */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle>Available Audio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                currentTrack?.id === track.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleTrackSelect(track)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Narrated by {track.narrator}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{track.book} {track.chapter}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTime(track.duration)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {track.premium && (
                    <Badge variant="secondary" className="bg-gradient-primary text-white">
                      Premium
                    </Badge>
                  )}
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}
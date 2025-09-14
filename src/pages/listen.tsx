import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { AudioPlayer } from '@/components/audio/audio-player';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play,
  Headphones,
  Search,
  Filter,
  Download,
  Crown,
  Mic,
  Radio,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface AudioAsset {
  id: string;
  type: 'bible' | 'sermon' | 'podcast' | 'music';
  title: string;
  description?: string;
  source_url: string;
  duration_seconds?: number;
  narrator?: string;
  premium_only: boolean;
  language: string;
  book_code?: string;
  chapter_number?: number;
}

export default function ListenPage() {
  const [currentTrack, setCurrentTrack] = useState<AudioAsset | null>(null);
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AudioAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudioAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [audioAssets, searchQuery, selectedType]);

  const loadAudioAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('audio_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAudioAssets(data || []);
    } catch (error) {
      console.error('Error loading audio assets:', error);
      toast.error('Failed to load audio content');
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = audioAssets;

    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query) ||
        asset.narrator?.toLowerCase().includes(query)
      );
    }

    setFilteredAssets(filtered);
  };

  const handleTrackSelect = (asset: AudioAsset) => {
    setCurrentTrack(asset);
  };

  const handleTrackChange = (trackId: string) => {
    const track = audioAssets.find(asset => asset.id === trackId);
    if (track) {
      setCurrentTrack(track);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bible': return <BookOpen className="w-4 h-4" />;
      case 'sermon': return <Mic className="w-4 h-4" />;
      case 'podcast': return <Radio className="w-4 h-4" />;
      default: return <Headphones className="w-4 h-4" />;
    }
  };

  const audioTypes = [
    { value: 'all', label: 'All Content', icon: Headphones },
    { value: 'bible', label: 'Bible Audio', icon: BookOpen },
    { value: 'sermon', label: 'Sermons', icon: Mic },
    { value: 'podcast', label: 'Podcasts', icon: Radio }
  ];

  return (
    <MainLayout currentTab="listen">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Listen</h1>
          <p className="text-muted-foreground">
            Experience Scripture through audio Bible, sermons, and spiritual content
          </p>
        </div>

        {/* Audio Player */}
        {currentTrack && (
          <AudioPlayer 
            track={{
              id: currentTrack.id,
              title: currentTrack.title,
              subtitle: currentTrack.narrator ? `Narrated by ${currentTrack.narrator}` : currentTrack.description,
              url: currentTrack.source_url,
              duration: currentTrack.duration_seconds
            }}
            playlist={audioAssets.map(asset => ({
              id: asset.id,
              title: asset.title,
              subtitle: asset.narrator ? `Narrated by ${asset.narrator}` : asset.description,
              url: asset.source_url,
              duration: asset.duration_seconds
            }))}
            onTrackChange={handleTrackChange}
          />
        )}

        {/* Search and Filter */}
        <LiquidGlassCard className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audio content..."
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {audioTypes.map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={selectedType === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(value)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </LiquidGlassCard>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <LiquidGlassCard key={i} className="p-4 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <LiquidGlassCard 
                key={asset.id} 
                className={`p-4 hover:scale-[1.02] transition-transform cursor-pointer ${
                  currentTrack?.id === asset.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTrackSelect(asset)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(asset.type)}
                        <h3 className="font-medium line-clamp-2">{asset.title}</h3>
                        {asset.premium_only && (
                          <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      {asset.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {asset.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                      </Badge>
                      {asset.duration_seconds && (
                        <span>{formatDuration(asset.duration_seconds)}</span>
                      )}
                    </div>
                    
                    {asset.narrator && (
                      <span className="text-xs truncate">{asset.narrator}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <LiquidGlassButton 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSelect(asset);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {currentTrack?.id === asset.id ? 'Now Playing' : 'Play'}
                    </LiquidGlassButton>
                    
                    {asset.premium_only ? (
                      <Button variant="outline" size="sm" disabled>
                        <Crown className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Headphones className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No audio content found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? 'Try different search terms or browse all content'
                : 'Audio content will appear here when available'
              }
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
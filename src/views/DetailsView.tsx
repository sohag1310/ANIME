import { motion } from "motion/react";
import { Play, Download, ChevronLeft, Search, Star, Bookmark, Send, Loader2 } from "lucide-react";
import { Anime } from "../types";
import { useState, useEffect } from "react";

export const DetailsView = ({
  anime,
  onBack,
  onPlay
}: {
  anime: Anime;
  onBack: () => void;
  onPlay: (episodeId: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'more' | 'comments'>('episodes');
  const [seriesData, setSeriesData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPath = anime.pageUrl || (anime.slug ? `/series/${anime.slug}` : "");
    if (!fetchPath) return;

    setLoadingDetails(true);
    fetch(`/api/toonstream/series?url=${encodeURIComponent(fetchPath)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setSeriesData(data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoadingDetails(false);
      });

    return () => { isMounted = false; };
  }, [anime]);

  const episodeList = (seriesData?.episodes && seriesData.episodes.length > 0)
    ? seriesData.episodes
    : Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        episode: i + 1,
        title: `Episode ${i + 1}`,
        duration: "24:00"
      }));

  const synopsisText = seriesData?.synopsis || anime.synopsis || "Full anime streaming in HD on ToonStream with multiple audio dubs and subtitle choices.";
  const genresList = seriesData?.genres?.slice(0, 5) || ["Anime", "Animation", "Action", "Fantasy"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-[#181a20] overflow-y-auto custom-scrollbar pb-32">
      {/* Top Navbar overlapping hero */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
        <button onClick={onBack} className="text-white hover:text-gray-300 transition-colors cursor-pointer bg-black/40 backdrop-blur-md p-2 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-square md:aspect-video lg:aspect-[21/9] max-h-[500px]">
        <img 
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
          alt={anime.title} 
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = `https://placehold.co/800x450/0a0a0a/ffffff?text=${encodeURIComponent(anime.title)}`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-[#181a20]/40 to-transparent"></div>
      </div>

      <div className="relative z-20 px-6 -mt-32 md:-mt-48 max-w-4xl mx-auto">
        {/* Title and actions header */}
        <div className="flex justify-between items-end mb-2">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-md pr-4 line-clamp-2">
            {anime.title_english || anime.title}
          </h1>
          <div className="flex gap-4">
            <button className="text-white hover:text-primary transition-colors cursor-pointer"><Bookmark className="w-5 h-5" /></button>
            <button className="text-white hover:text-primary transition-colors cursor-pointer"><Send className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium mb-6">
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-3.5 h-3.5 fill-primary" />
            <span>{anime.score || "8.5"}</span>
          </div>
          <span className="text-gray-400">{anime.year || "2024"}</span>
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] md:text-xs uppercase font-bold">HD</span>
          <span className="border border-white/20 text-gray-300 px-2 py-0.5 rounded text-[10px] md:text-xs">ToonStream</span>
          <span className="border border-white/20 text-gray-300 px-2 py-0.5 rounded text-[10px] md:text-xs">Sub & Dub</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => onPlay(1)} className="flex-1 bg-primary text-black py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20 cursor-pointer">
            <Play className="w-4 h-4 fill-black" /> Play Episode 1
          </button>
          <button onClick={() => onPlay(1)} className="flex-1 bg-[#1f222a] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#2a2e39] transition-colors border border-white/5 cursor-pointer">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>

        {/* Synopsis & Genres */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {genresList.map((g: string, idx: number) => (
              <span key={idx} className="bg-zinc-900 border border-zinc-800 text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">
                {g}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-light">
            {synopsisText}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 flex justify-between mb-6">
          <button 
            onClick={() => setActiveTab('episodes')}
            className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'episodes' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            Episodes ({episodeList.length})
          </button>
          <button 
            onClick={() => setActiveTab('more')}
            className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'more' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            ToonStream Info
          </button>
          <button 
            onClick={() => setActiveTab('comments')}
            className={`pb-4 px-2 font-semibold text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            Community
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'episodes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Available Episodes {loadingDetails && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              </h3>
              <span className="text-primary text-sm font-medium">Season 1</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-6">
              {episodeList.map((ep: any) => (
                <div 
                  key={ep.id}
                  onClick={() => onPlay(ep.episode || ep.id)}
                  className="cursor-pointer group"
                >
                  <div className="w-full aspect-video rounded-xl overflow-hidden relative mb-2 border border-white/5 bg-[#0a0a0a] group-hover:border-primary/50 transition-colors">
                    <img 
                      src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={`Episode ${ep.episode || ep.id}`}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/90 text-black flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1 right-2 text-[10px] text-white font-bold drop-shadow-md bg-black/70 px-1.5 py-0.5 rounded">
                      EP {ep.episode || ep.id}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-200 truncate group-hover:text-primary transition-colors">
                    {ep.title || `Episode ${ep.episode || ep.id}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'more' && (
          <div className="py-6 text-gray-400 text-sm space-y-2">
            <p><strong className="text-white">Source:</strong> ToonStream Official Network</p>
            <p><strong className="text-white">Playback:</strong> Multi-server fast streaming</p>
            <p><strong className="text-white">Audio:</strong> Multi-Audio (Hindi Dub, English Dub, Japanese Sub)</p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="py-12 text-center text-gray-500 text-sm">
            Community discussions for this ToonStream series.
          </div>
        )}
      </div>
    </motion.div>
  );
};

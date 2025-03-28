import React, { useState, useEffect, useRef, useContext } from 'react';
import { BsUpload, BsVolumeUp, BsVolumeOff, BsClockHistory } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { FaFilePdf } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AppContext } from '../../../Context/AppContext';

const PDFSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const {backendUrl} = useContext(AppContext);

  useEffect(() => {
    fetchSummaryHistory();
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const handleError = (e) => {
        console.error('Audio error:', e);
        toast.error('Failed to load audio file');
        setIsPlaying(false);
      };
      
      audioElement.addEventListener('error', handleError);
      
      return () => {
        audioElement.removeEventListener('error', handleError);
      };
    }
  }, [audioRef.current]);

  const fetchSummaryHistory = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/summarization/history`, { withCredentials: true });
      const historyData = Array.isArray(response.data) ? response.data : [];
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast.error('Failed to load summary history');
      setHistory([]); 
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    setIsLoading(true);
    setSummary('');
    setAudioUrl('');

    try {
      const response = await axios.post(`${backendUrl}/api/summarization/summarize`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSummary(response.data.summary);
      
      const fullAudioUrl = response.data.audioUrl.startsWith('http') 
        ? response.data.audioUrl 
        : `${backendUrl}${response.data.audioUrl}`;
      
      setAudioUrl(fullAudioUrl);
      
      toast.success('PDF summarized successfully!');
      fetchSummaryHistory();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Summarization error:', error);
      if (error.response?.status === 403) {
        toast.error('Summarization limit reached (max 10)');
      } else {
        toast.error('Failed to summarize PDF');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.load();
        audioRef.current.play().catch(err => {
          console.error('Play error:', err);
          toast.error('Cannot play audio: ' + err.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleHistoryItemClick = (item) => {
    setSummary(item.summary);
    
    // Ensure the audioUrl is fully qualified with the backend URL
    const fullAudioUrl = item.audioUrl.startsWith('http') 
      ? item.audioUrl 
      : `${backendUrl}${item.audioUrl}`;
    
    setAudioUrl(fullAudioUrl);
    
    // Reset playing state when switching to a new audio
    setIsPlaying(false);
    
    // If there's a current audio element, pause it
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateFilename = (filename) => {
    if (!filename) return 'Unnamed File';
    if (filename.length > 15) {
      return filename.substring(0, 15) + '...';
    }
    return filename;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden mt-6 shadow-xl  hover:shadow-2xl">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <h2 className="text-xl font-bold text-white">PDF Summarizer</h2>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Left panel - Upload and History */}
        <div className="w-full md:w-1/3 p-6 border-r border-gray-200">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Upload Your PDF</h3>
            <form onSubmit={handleSubmit}>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                <BsUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  {file ? file.name : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-gray-400">PDF files only</p>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  ref={fileInputRef}
                />
              </div>
              <button 
                type="submit" 
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={!file || isLoading}
              >
                {isLoading ? 'Processing...' : 'Summarize'}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BsClockHistory className="mr-2" /> Previous Summaries
            </h3>
            <div
          className="space-y-4 max-h-[150px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default"
         
        >
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No previous summaries found</p>
              ) : (
                history.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                    onClick={() => handleHistoryItemClick(item)}
                  >
                    <div className="flex items-center">
                      <FaFilePdf className="text-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{truncateFilename(item.originalFilename)}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right panel - Summary and Audio */}
        <div className="w-full md:w-2/3 p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Summary</h3>
            {audioUrl && (
              <div className="flex items-center">
                <button 
                  onClick={handleAudioPlay} 
                  className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {isPlaying ? <BsVolumeUp className="text-blue-600" /> : <BsVolumeOff className="text-blue-600" />}
                </button>
                <audio 
                  ref={audioRef} 
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  controls={false}
                >
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto scrollbar-hide hover:scrollbar-default">
            {summary ? (
              <p className="text-gray-700 whitespace-pre-line">{summary}</p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 mb-2">Upload a PDF document to see the summary here</p>
                <p className="text-xs text-gray-300">The summary will be displayed in this area</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFSummarizer;
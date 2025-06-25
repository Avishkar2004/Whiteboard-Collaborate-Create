import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Brush,
  Save,
  Trash2,
  Undo2,
  Redo2,
  Palette,
  Eraser,
  ArrowLeft,
  User,
  Calendar,
  Edit3,
  Share2,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import api, { API_URL, API_ENDPOINTS } from '../components/config/api';
import ShareElementsModal from '../components/ShareElementsModal';

const Whiteboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [whiteboardInfo, setWhiteboardInfo] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth] = useState(5);

  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  // To only show the share elements button to the owner of whiteboard
  const isOwner = user?.id === whiteboardInfo?.owner?._id || user?.id === whiteboardInfo?.owner;
  const redrawCanvas = useCallback(() => {
    if (!contextRef.current) return;
    const context = contextRef.current;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Redraw only the active part of the history
    const historyToDraw = drawingHistory.slice(0, historyPointer + 1);

    historyToDraw.forEach((path) => {
      context.strokeStyle = path.color;
      context.lineWidth = path.lineWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      path.points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.stroke();
    });
  }, [drawingHistory, historyPointer]);

  // Effect for setting up canvas, context, and socket
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    const newSocket = io(API_URL, { auth: { token } });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token, color, lineWidth, tool]);

  // Effect for redrawing when history changes
  useEffect(() => {
    redrawCanvas();
  }, [drawingHistory, historyPointer, redrawCanvas]);

  // Load existing whiteboard content and info
  useEffect(() => {
    const loadWhiteboard = async () => {
      try {
        const response = await api.get(`${API_ENDPOINTS.whiteboard.getWhiteboard}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { content = {}, ...whiteboardData } = response.data;
        const elements = content.elements || [];
        setWhiteboardInfo(whiteboardData);

        if (elements && elements.length > 0) {
          setDrawingHistory(elements);
          setHistoryPointer(elements.length - 1);
        }
      } catch (error) {
        console.error('Error loading whiteboard:', error);
      }
    };
    if (token && id) {
      loadWhiteboard();
    }
  }, [id, token]);

  // Socket.io event listeners
  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', id);

    const handleDraw = (data) => {
      const context = contextRef.current;
      context.strokeStyle = data.color;
      context.lineWidth = data.lineWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      data.points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.stroke();
    };

    socket.on('draw', handleDraw);

    return () => {
      socket.off('draw', handleDraw);
    };
  }, [socket, id]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const newPath = {
      tool,
      color: tool === 'eraser' ? '#FFFFFF' : color,
      lineWidth: tool === 'eraser' ? 20 : lineWidth,
      points: [{ x: offsetX, y: offsetY }],
    };

    // When starting a new line, truncate the future history
    const newHistory = drawingHistory.slice(0, historyPointer + 1);

    setDrawingHistory([...newHistory, newPath]);
    setHistoryPointer(newHistory.length);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    // Add the new point to the current path in history
    const updatedHistory = [...drawingHistory];
    updatedHistory[historyPointer].points.push({ x: offsetX, y: offsetY });
    setDrawingHistory(updatedHistory);

    redrawCanvas(); // Redraw to show the line as it's being drawn

    if (socket) {
      socket.emit('draw', {
        roomId: id,
        ...updatedHistory[historyPointer]
      });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleUndo = useCallback(() => {
    if (historyPointer >= 0) {
      setHistoryPointer(prev => prev - 1);
    }
  }, [historyPointer]);

  const handleRedo = useCallback(() => {
    if (historyPointer < drawingHistory.length - 1) {
      setHistoryPointer(prev => prev + 1);
    }
  }, [historyPointer, drawingHistory.length]);

  const saveWhiteboard = async () => {
    try {
      const activeHistory = drawingHistory.slice(0, historyPointer + 1);
      await api.put(
        `${API_ENDPOINTS.whiteboard.save}${id}`,
        { content: { elements: activeHistory } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Whiteboard saved!');
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      alert('Failed to save whiteboard.');
    }
  };

  const clearCanvas = () => {
    setDrawingHistory([]);
    setHistoryPointer(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-0 items-start sm:items-center justify-between z-10 w-full">
        {/* Left side - Back button and whiteboard info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="border-l border-gray-300 pl-4 mt-2 sm:mt-0">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">
              {whiteboardInfo?.name || 'Loading...'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{user.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {whiteboardInfo?.lastModified
                    ? new Date(whiteboardInfo.lastModified).toLocaleDateString()
                    : 'Unknown'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Drawing tools */}
        <div className="flex items-center gap-2 flex-wrap mt-3 sm:mt-0">
          <button onClick={() => setTool('brush')} className={`p-2 rounded-lg ${tool === 'brush' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}>
            <Brush className="w-5 h-5" />
          </button>
          <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}>
            <Eraser className="w-5 h-5" />
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <button onClick={handleUndo} className="p-2 rounded-lg hover:bg-gray-100 disabled:text-gray-300" disabled={historyPointer < 0}>
            <Undo2 className="w-5 h-5" />
          </button>
          <button onClick={handleRedo} className="p-2 rounded-lg hover:bg-gray-100 disabled:text-gray-300" disabled={historyPointer >= drawingHistory.length - 1}>
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Right side - Actions and user info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected as {user?.username}</span>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden xs:inline">Share Elements</span>
              </button>
            )}
            <button onClick={saveWhiteboard} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Save className="w-4 h-4" />
              <span className="hidden xs:inline">Save</span>
            </button>
            <button onClick={clearCanvas} className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-grow w-full h-full overflow-auto">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full h-[60vh] sm:h-[70vh] md:h-[80vh] block bg-white rounded-b-xl shadow"
        />
      </div>

      {/* Share Elements Modal */}
      {isOwner && (
        <ShareElementsModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          whiteboard={whiteboardInfo}
          drawingHistory={drawingHistory}
        />
      )}
    </div>
  );
};

export default Whiteboard; 
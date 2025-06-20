import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Brush,
  Save,
  Trash2,
  Undo2,
  Redo2,
  Palette,
  Eraser,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import api, { API_ENDPOINTS } from '../components/config/api';

const Whiteboard = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  
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

    const newSocket = io('http://localhost:5000', { auth: { token } });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);
  
  // Effect for redrawing when history changes
  useEffect(() => {
    redrawCanvas();
  }, [drawingHistory, historyPointer, redrawCanvas]);

  // Load existing whiteboard content
  useEffect(() => {
    const loadWhiteboard = async () => {
      try {
        const response = await api.get(`${API_ENDPOINTS.whiteboard.getWhiteboard}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { elements } = response.data.content;
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
        `/api/whiteboards/${id}`,
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
      <div className="bg-white shadow-lg p-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
            <button onClick={() => setTool('brush')} className={`p-2 rounded-lg ${tool === 'brush' ? 'bg-indigo-100 text-indigo-600' : ''}`}>
                <Brush />
            </button>
            <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-600' : ''}`}>
                <Eraser />
            </button>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8"/>
            <button onClick={handleUndo} className="p-2 rounded-lg hover:bg-gray-100 disabled:text-gray-300" disabled={historyPointer < 0}>
                <Undo2 />
            </button>
            <button onClick={handleRedo} className="p-2 rounded-lg hover:bg-gray-100 disabled:text-gray-300" disabled={historyPointer >= drawingHistory.length - 1}>
                <Redo2 />
            </button>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={saveWhiteboard} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Save />
                <span>Save</span>
            </button>
            <button onClick={clearCanvas} className="p-2 rounded-lg hover:bg-red-100 text-red-500">
                <Trash2 />
            </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-grow w-full h-full">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair"
        />
      </div>
    </div>
  );
};

export default Whiteboard; 
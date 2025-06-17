import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Brush as BrushIcon,
  TextFields as TextIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ColorLens as ColorIcon,
  LineWeight as LineWeightIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { API_ENDPOINTS } from '../components/config/api';

const Whiteboard = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLineWidth, setShowLineWidth] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: { token },
    });

    newSocket.emit('join-room', id);

    newSocket.on('draw', (data) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(data.x0, data.y0);
      ctx.lineTo(data.x1, data.y1);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.lineWidth;
      ctx.stroke();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id, token]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;

    // Load whiteboard content
    const loadWhiteboard = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.whiteboard.get}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.content.elements) {
          response.data.content.elements.forEach((element) => {
            ctx.beginPath();
            ctx.moveTo(element.x0, element.y0);
            ctx.lineTo(element.x1, element.y1);
            ctx.strokeStyle = element.color;
            ctx.lineWidth = element.lineWidth;
            ctx.stroke();
          });
        }
      } catch (error) {
        console.error('Error loading whiteboard:', error);
      }
    };

    loadWhiteboard();
  }, [id, token]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (socket) {
      socket.emit('draw', {
        roomId: id,
        x0: e.nativeEvent.offsetX - 1,
        y0: e.nativeEvent.offsetY - 1,
        x1: e.nativeEvent.offsetX,
        y1: e.nativeEvent.offsetY,
        color,
        lineWidth,
      });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveWhiteboard = async () => {
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      await axios.put(
        `${API_ENDPOINTS.whiteboard.update}/${id}`,
        { content: { imageData } },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Error saving whiteboard:', error);
    }
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const lineWidths = [1, 2, 4, 6, 8];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Drawing Tools */}
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
              <button
                onClick={() => setTool('brush')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  tool === 'brush'
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <BrushIcon />
              </button>
              <button
                onClick={() => setTool('text')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  tool === 'text'
                    ? 'bg-primary-100 text-primary-600'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <TextIcon />
              </button>
            </div>

            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                style={{ color: color }}
              >
                <ColorIcon />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Line Width */}
            <div className="relative">
              <button
                onClick={() => setShowLineWidth(!showLineWidth)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors duration-200"
              >
                <LineWeightIcon />
              </button>
              {showLineWidth && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-10">
                  <div className="space-y-2">
                    {lineWidths.map((width) => (
                      <button
                        key={width}
                        onClick={() => {
                          setLineWidth(width);
                          setShowLineWidth(false);
                        }}
                        className="w-full h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors duration-200"
                      >
                        <div
                          className="bg-black rounded-full"
                          style={{ width: width * 4, height: width }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors duration-200"
            >
              <DeleteIcon />
            </button>
            <button
              onClick={saveWhiteboard}
              className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors duration-200"
            >
              <SaveIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="cursor-crosshair bg-white"
        />
      </div>
    </div>
  );
};

export default Whiteboard; 
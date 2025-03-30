/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useCallback, useEffect, Component } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { Card, ChartTooltip } from "./ui"
import { useTheme } from "next-themes"

interface HardwareChartProps {
  data: Array<{ component: string, score: number }>;
}

// Custom color palette with theme variants
const getColorPalette = (isDark: boolean) => ({
  cpu: '#3b82f6', // blue-500
  gpu: '#10b981', // green-500 
  ram: '#8b5cf6', // purple-500
  grid: isDark ? '#334155' : '#e2e8f0', // dark: slate-700, light: slate-200
  stroke: isDark ? '#64748b' : '#94a3b8', // dark: slate-500, light: slate-400
  tooltipBg: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  background: isDark ? '#1e293b' : '#f8fafc', // Updated: Dark background for dark mode, light blue-gray for light mode
  
  // Impact level colors
  critical: {
    fill: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.2)', // red-500 with opacity
    stroke: '#ef4444', // red-500
  },
  high: {
    fill: isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)', // amber-500 with opacity
    stroke: '#f59e0b', // amber-500
  },
  balanced: {
    fill: isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.2)', // green-500 with opacity
    stroke: '#22c55e', // green-500
  },
  neutral: {
    fill: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.2)', // blue-500 with opacity
    stroke: '#3b82f6', // blue-500
  }
});

export function HardwareChart({ data }: HardwareChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colorPalette = getColorPalette(isDark);
  
  // Track the hovered component state
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  // Manage chart colors as state values to force re-renders
  const [chartFill, setChartFill] = useState(colorPalette.neutral.fill);
  const [chartStroke, setChartStroke] = useState(colorPalette.neutral.stroke);
  // Force re-renders when needed
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Find bottleneck component (highest score)
  const bottleneckComponent = data.reduce(
    (max, item) => (item.score > max.score ? item : max),
    { component: '', score: -1 }
  ).component;
  
  // Handle hover with simpler approach
  const handleHover = useCallback((component: string | null) => {
    setHoveredComponent(component);
  }, []);
  
  // Update chart colors whenever hoveredComponent changes
  useEffect(() => {
    // Get updated color palette based on current theme
    const palette = getColorPalette(isDark);
    
    let fill = palette.neutral.fill;
    let stroke = palette.neutral.stroke;
    
    // Set default colors based on highest impact when not hovering
    if (!hoveredComponent) {
      const maxScore = Math.max(...data.map(item => item.score));
      if (maxScore > 15) {
        fill = palette.critical.fill;
        stroke = palette.critical.stroke;
      } else if (maxScore > 10) {
        fill = palette.high.fill;
        stroke = palette.high.stroke;
      } else {
        fill = palette.balanced.fill;
        stroke = palette.balanced.stroke;
      }
    } else {
      // Set colors based on the hovered component
      const componentData = data.find(item => item.component === hoveredComponent);
      if (componentData) {
        if (hoveredComponent === bottleneckComponent) {
          fill = palette.critical.fill;
          stroke = palette.critical.stroke;
        } else if (componentData.score > 10) {
          fill = palette.high.fill;
          stroke = palette.high.stroke;
        } else {
          fill = palette.balanced.fill;
          stroke = palette.balanced.stroke;
        }
      }
    }
    
    // Update state to trigger re-render
    setChartFill(fill);
    setChartStroke(stroke);
    setForceUpdate(prev => prev + 1);
    
  }, [hoveredComponent, data, bottleneckComponent, isDark]);
  
  // Simple dot component
  const DotComponent = ({ cx, cy, payload }: any | Component) => {
    const isHovered = hoveredComponent === payload.component;
    const palette = getColorPalette(isDark);
    
    // Get dot color
    let dotColor;
    if (payload.component === bottleneckComponent) {
      dotColor = palette.critical.stroke;
    } else if (payload.score > 10) {
      dotColor = palette.high.stroke;
    } else {
      if (payload.component === 'CPU') dotColor = palette.cpu;
      else if (payload.component === 'GPU') dotColor = palette.gpu;
      else if (payload.component === 'RAM') dotColor = palette.ram;
      else dotColor = palette.balanced.stroke;
    }
    
    return (
      <g>
        {/* Main dot */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={isHovered ? 8 : 5}
          fill={dotColor}
          stroke={isDark ? "#1e293b" : "white"}
          strokeWidth={2}
          className="drop-shadow-sm"
          onMouseEnter={() => handleHover(payload.component)}
        />
      </g>
    );
  };
  
  // Tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] | string[] }) => {
    if (!active || !payload || !payload.length) return null;
    
    const component = payload[0]?.payload.component;
    const score = payload[0]?.value || 0;
    const isBottleneck = component === bottleneckComponent;
    
    // Ensure hoveredComponent is updated when tooltip shows
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (component && component !== hoveredComponent) {
        handleHover(component);
      }
    }, [component]);
    
    let bgColor = isDark ? "bg-slate-800" : "bg-white";
    let textColor = isDark ? "text-slate-200" : "text-gray-800";
    let statusText = "Low Impact";
    
    if (isBottleneck) {
      bgColor = isDark ? "bg-red-900/30" : "bg-red-50";
      textColor = isDark ? "text-red-300" : "text-red-700";
      statusText = "Bottleneck";
    } else if (score > 10) {
      bgColor = isDark ? "bg-amber-900/30" : "bg-amber-50";
      textColor = isDark ? "text-amber-300" : "text-amber-700";
      statusText = "High Impact";
    } else {
      bgColor = isDark ? "bg-green-900/30" : "bg-green-50";
      textColor = isDark ? "text-green-300" : "text-green-700";
    }
    
    return (
      <div className={`${bgColor} p-3 rounded-md shadow-md border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        <p className="font-medium text-sm mb-1">
          <span className="font-bold">{component}</span>
          {isBottleneck && <span className="ml-2 text-red-500">⚠️</span>}
        </p>
        <p className={`text-sm ${textColor} font-semibold`}>
          Impact: {Number(score).toFixed(1)}
        </p>
        <p className="text-xs mt-1 opacity-75">{statusText}</p>
      </div>
    );
  };
  
  // Force chart to recreate when values change
  const chartKey = `radar-chart-${hoveredComponent || 'none'}-${forceUpdate}-${theme}`;
  
  return (
    <Card>
      <Card.Header className="items-center">
        <Card.Title>Component Impact Analysis</Card.Title>
        <Card.Description>Higher values indicate potential performance limitations</Card.Description>
      </Card.Header>
      <Card.Content className="pt-4">        
        {/* Chart container */}
        <div 
          className="mx-auto aspect-square w-full max-h-[300px] relative" 
          style={{ backgroundColor: colorPalette.background }}
        >
          {/* Make sure background is applied in both light and dark mode */}
          <div 
            className="absolute inset-0 rounded-lg" 
            style={{ backgroundColor: colorPalette.background }}
          ></div>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              key={chartKey} 
              data={data} 
              margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              style={{ backgroundColor: 'transparent' }}
            >
              <ChartTooltip content={<CustomTooltip />} cursor={false} />
              <PolarGrid 
                stroke={colorPalette.grid} 
                strokeDasharray="3 3" 
               
              />
              <PolarAngleAxis 
                dataKey="component" 
                tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 14, fontWeight: 600 }}
                onClick={({ value }) => handleHover(value as string)}
                tickLine={{ stroke: isDark ? '#475569' : undefined }}
                axisLine={{ stroke: isDark ? '#475569' : undefined }}
              />
              <Radar
                name="Impact"
                dataKey="score"
                stroke={chartStroke}
                fill={chartFill}
                fillOpacity={0.7}
                dot={<DotComponent />}
                activeDot={{ r: 8, strokeWidth: 2, stroke: isDark ? "#1e293b" : "white" }}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorPalette.critical.stroke }}></div>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Bottleneck</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorPalette.high.stroke }}></div>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>High Impact</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorPalette.balanced.stroke }}></div>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Low Impact</span>
          </div>
        </div>
        
        {/* Current selection display */}
        <div className={`mt-3 text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {hoveredComponent ? 
            `Viewing: ${hoveredComponent}` : 
            'Hover over a component to see details'
          }
        </div>
      </Card.Content>
    </Card>
  );
}

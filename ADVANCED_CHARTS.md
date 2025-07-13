# Advanced Data Visualization Components

This project now includes advanced data visualization components with sophisticated animations and comprehensive accessibility features.

## 🎯 Key Features

### 1. Advanced Animations
- **Entrance Animations**: Smooth fade-in and slide-up effects using Intersection Observer
- **Staggered Animations**: Sequential animation of chart elements with customizable delays
- **Interactive Animations**: Smooth hover effects and transitions
- **Configurable Timing**: Customizable animation duration and easing functions
- **Performance Optimized**: Uses CSS transforms and GPU acceleration

### 2. Accessibility Features
- **Keyboard Navigation**: Full keyboard support with arrow keys, Home/End navigation
- **Screen Reader Support**: ARIA labels, descriptions, and live announcements
- **High Contrast Mode**: Alternative color schemes for better visibility
- **Focus Management**: Clear focus indicators and logical tab order
- **Reduced Motion**: Respects user's motion preferences

### 3. Interactive Features
- **Hover Effects**: Rich tooltips with contextual information
- **Click Handlers**: Customizable data point selection
- **Zoom and Pan**: Responsive containers with overflow handling
- **Real-time Updates**: Dynamic data binding with smooth transitions

## 📊 Available Components

### AdvancedAnimatedChart
A versatile chart component supporting multiple visualization types:

```tsx
import { AdvancedAnimatedChart } from './components/charts';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  // ... more data
];

const series = [
  {
    dataKey: 'revenue',
    name: 'Revenue',
    color: '#3b82f6',
    type: 'line'
  },
  {
    dataKey: 'expenses', 
    name: 'Expenses',
    color: '#ef4444',
    type: 'area'
  }
];

<AdvancedAnimatedChart
  data={data}
  series={series}
  chartType="mixed"
  title="Financial Performance"
  enableAnimations={true}
  keyboardNavigation={true}
  highContrast={false}
  onDataPointClick={(data, series) => console.log(data)}
  formatYAxis={(value) => `$${value.toLocaleString()}`}
  xAxisLabel="Month"
  yAxisLabel="Amount ($)"
/>
```

**Props:**
- `chartType`: 'line' | 'area' | 'bar' | 'pie' | 'mixed'
- `animationDuration`: Animation timing in milliseconds
- `staggerDelay`: Delay between element animations
- `enableAnimations`: Toggle animations on/off
- `keyboardNavigation`: Enable keyboard controls
- `highContrast`: Use high contrast colors
- `onDataPointClick`: Click event handler
- `formatYAxis`: Y-axis value formatter
- `gradientFill`: Enable gradient fills for areas

### AdvancedHeatmap
Interactive heatmap with cell-level interactions:

```tsx
import { AdvancedHeatmap } from './components/charts';

const heatmapData = [
  { x: 'Mon', y: 0, value: 45 },
  { x: 'Mon', y: 1, value: 67 },
  // ... more data
];

<AdvancedHeatmap
  data={heatmapData}
  title="Activity Heatmap"
  cellSize={24}
  cellGap={2}
  minColor="#f0f9ff"
  maxColor="#1e40af"
  onCellClick={(data) => console.log(data)}
  formatValue={(value) => value.toString()}
  xAxisLabel="Hour"
  yAxisLabel="Day"
  keyboardNavigation={true}
/>
```

**Props:**
- `cellSize`: Size of each heatmap cell in pixels
- `cellGap`: Gap between cells
- `colorScale`: Custom color array for value mapping
- `minColor`/`maxColor`: Color range endpoints
- `onCellClick`: Cell selection handler
- `formatValue`: Cell value formatter
- `showLabels`: Display values in cells

### AdvancedTreemap
Hierarchical data visualization with interactive nodes:

```tsx
import { AdvancedTreemap } from './components/charts';

const treemapData = [
  { name: 'Marketing', value: 450000 },
  { name: 'Development', value: 380000 },
  { name: 'Sales', value: 320000 },
  // ... more data
];

<AdvancedTreemap
  data={treemapData}
  title="Budget Allocation"
  enableAnimations={true}
  onNodeClick={(data) => console.log('Node clicked:', data)}
  formatValue={(value) => `$${value.toLocaleString()}`}
  keyboardNavigation={true}
  announceData={true}
/>
```

**Features:**
- Proportional rectangle sizing based on data values
- Interactive hover and click handlers
- Keyboard navigation with arrow keys
- Customizable colors and formatting
- Accessibility announcements for screen readers

### AdvancedRadarChart
Multi-dimensional data comparison with radar/spider charts:

```tsx
import { AdvancedRadarChart } from './components/charts';

const radarDatasets = [
  {
    name: 'Frontend Skills',
    data: [
      { subject: 'React', value: 90, fullMark: 100 },
      { subject: 'TypeScript', value: 85, fullMark: 100 },
      { subject: 'CSS', value: 95, fullMark: 100 },
      // ... more dimensions
    ],
    color: '#3b82f6',
    fillOpacity: 0.3
  }
];

<AdvancedRadarChart
  datasets={radarDatasets}
  title="Skill Proficiency"
  enableAnimations={true}
  showGrid={true}
  gridLevels={5}
  onDataPointClick={(data, dataset) => console.log('Point clicked:', data)}
  formatValue={(value) => `${value}%`}
/>
```

**Features:**
- Multiple datasets on the same radar
- Configurable grid levels and styling
- Interactive data points with hover effects
- Smooth path animations with staggered timing
- Keyboard navigation between datasets and points

### AdvancedParallelCoordinates
Multi-dimensional data exploration with parallel coordinates:

```tsx
import { AdvancedParallelCoordinates } from './components/charts';

const parallelData = [
  {
    id: 'product-a',
    values: { Price: 25, Quality: 85, Performance: 78 },
    category: 'Premium'
  },
  // ... more data points
];

const dimensions = ['Price', 'Quality', 'Performance'];

<AdvancedParallelCoordinates
  data={parallelData}
  dimensions={dimensions}
  title="Product Comparison"
  enableAnimations={true}
  lineOpacity={0.7}
  onLineClick={(data) => console.log('Line clicked:', data)}
  formatValue={(value, dimension) => {
    if (dimension === 'Price') return `$${value}`;
    return `${value}%`;
  }}
/>
```

**Features:**
- Multi-dimensional data visualization
- Category-based color coding
- Interactive line highlighting on hover
- Dimension-specific value formatting
- Smooth path animations with glow effects

## 🎮 Interaction Patterns

### Keyboard Navigation
All charts support comprehensive keyboard navigation:

- **Arrow Keys**: Navigate between data points
- **Home/End**: Jump to first/last data point
- **Enter/Space**: Select current data point
- **Tab**: Focus on chart container
- **Escape**: Exit focus (browser default)

### Mouse Interactions
- **Hover**: Display detailed tooltips
- **Click**: Select data points or cells
- **Scroll**: Navigate overflow content
- **Focus**: Visual focus indicators

### Touch Support
- **Tap**: Select data points
- **Scroll**: Pan through data
- **Pinch**: Zoom (where applicable)

## 🎨 Styling and Theming

### CSS Custom Properties
The components use CSS custom properties for consistent theming:

```css
:root {
  --chart-primary-color: #3b82f6;
  --chart-background: #ffffff;
  --chart-text-color: #374151;
  --chart-grid-color: #e5e7eb;
}

.dark {
  --chart-background: #1f2937;
  --chart-text-color: #d1d5db;
  --chart-grid-color: #374151;
}
```

### Animation Classes
Pre-built animation classes for consistent motion:

```css
.chart-animate-enter { /* Entrance animation */ }
.chart-animate-bar { /* Bar growth animation */ }
.chart-animate-line { /* Line drawing animation */ }
.chart-animate-pulse { /* Pulse effect */ }
```

### Accessibility Classes
```css
.chart-focus-ring { /* Focus indicator */ }
.chart-high-contrast { /* High contrast mode */ }
.heatmap-cell { /* Heatmap cell styling */ }
```

## 🔧 Configuration Options

### Performance Settings
```tsx
// Optimize for performance
<AdvancedAnimatedChart
  animationDuration={500} // Faster animations
  staggerDelay={50} // Reduced stagger
  enableAnimations={window.matchMedia('(prefers-reduced-motion: no-preference)').matches}
/>
```

### Accessibility Settings
```tsx
// Maximum accessibility
<AdvancedAnimatedChart
  keyboardNavigation={true}
  announceData={true}
  highContrast={userPreference.highContrast}
  ariaLabel="Financial performance chart showing revenue and expenses"
  description="Monthly data from January to December 2024"
/>
```

### Responsive Design
```tsx
// Auto-responsive charts
<AdvancedAnimatedChart
  width="100%" // or undefined for auto-width
  height={window.innerHeight < 600 ? 300 : 400}
/>
```

## 🚀 Best Practices

### Data Preparation
```tsx
// Ensure consistent data structure
const cleanData = rawData.map(item => ({
  name: item.label || 'Unknown',
  value: Number(item.value) || 0,
  // Add other required fields
}));
```

### Performance Optimization
```tsx
// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return rawData.map(transformData);
}, [rawData]);

// Debounce interactive updates
const debouncedHandler = useMemo(
  () => debounce(handleDataUpdate, 150),
  []
);
```

### Error Handling
```tsx
// Graceful fallbacks
<AdvancedAnimatedChart
  data={data.length > 0 ? data : defaultData}
  enableAnimations={!window.matchMedia('(prefers-reduced-motion)').matches}
  onError={(error) => console.error('Chart error:', error)}
/>
```

## 📱 Mobile Considerations

### Touch Interactions
- Optimized touch targets (minimum 44px)
- Gesture support for navigation
- Responsive tooltip positioning

### Performance
- Reduced animation complexity on mobile
- Efficient rendering for smaller screens
- Battery-conscious update patterns

### Layout
- Adaptive sizing for different screen sizes
- Horizontal scrolling for wide charts
- Collapsible legends and controls

## 🧪 Testing

### Accessibility Testing
```bash
# Run with screen reader
# Test keyboard navigation
# Verify color contrast ratios
# Check ARIA attributes
```

### Performance Testing
```bash
# Monitor animation performance
# Check memory usage
# Test with large datasets
# Verify mobile performance
```

### Browser Compatibility
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Progressive enhancement for older browsers
- Polyfills included where needed

## 🔮 Future Enhancements

- **3D Visualizations**: WebGL-based 3D charts
- **Real-time Streaming**: Live data updates
- **Collaborative Features**: Multi-user interactions
- **Advanced Analytics**: Built-in statistical analysis
- **Export Features**: PDF, SVG, and image export
- **Plugin System**: Extensible architecture

## 📚 Resources

- [Recharts Documentation](https://recharts.org/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Chart.js Best Practices](https://www.chartjs.org/docs/latest/)
- [D3.js Examples](https://observablehq.com/@d3/gallery)

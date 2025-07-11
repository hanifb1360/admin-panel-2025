import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';
import { useWebSocketContext } from '../hooks/useWebSocketContext';

export default function ConnectionStatus() {
  const { connectionStatus, connect, disconnect } = useWebSocketContext();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'Connected':
        return <Wifi className="w-4 h-4" />;
      case 'Connecting':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'Error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected':
        return designSystem.colors.text.success;
      case 'Connecting':
        return designSystem.colors.text.warning;
      case 'Error':
        return designSystem.colors.text.error;
      default:
        return designSystem.colors.text.muted;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'Connected':
        return 'Live';
      case 'Connecting':
        return 'Connecting...';
      case 'Error':
        return 'Error';
      default:
        return 'Offline';
    }
  };

  const handleClick = () => {
    if (connectionStatus === 'Connected') {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        designSystem.layout.flex.start,
        designSystem.spacing.gap.sm,
        'px-3 py-2',
        designSystem.effects.rounded.lg,
        designSystem.states.hover.bg.gray100,
        designSystem.effects.transition.colors,
        'cursor-pointer'
      )}
      title={`Real-time updates are ${connectionStatus.toLowerCase()}. Click to ${connectionStatus === 'Connected' ? 'disconnect' : 'connect'}.`}
    >
      <span className={cn(getStatusColor())}>
        {getStatusIcon()}
      </span>
      <span className={cn(designSystem.typography.body.sm, getStatusColor())}>
        {getStatusText()}
      </span>
    </button>
  );
}

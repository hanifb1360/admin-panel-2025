import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

export default function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className={componentVariants.card.default}>
      <div className={designSystem.layout.flex.between}>
        <div>
          <p className={cn(designSystem.typography.body.sm, designSystem.typography.weight.medium, designSystem.colors.text.secondary)}>
            {title}
          </p>
          <p className={cn(designSystem.typography.display.xl, designSystem.colors.text.primary, designSystem.spacing.margin.top.sm)}>
            {value}
          </p>
        </div>
        <div className={cn(
          componentVariants.iconContainer.medium,
          designSystem.colors.primary[50],
        )}>
          <Icon className={cn('w-6 h-6', designSystem.colors.text.primaryAccent)} />
        </div>
      </div>
      
      <div className={cn(designSystem.spacing.margin.top.md, designSystem.layout.flex.start)}>
        {trend === 'up' ? (
          <TrendingUp className={cn('w-4 h-4', designSystem.colors.text.successLight, designSystem.spacing.margin.right.sm)} />
        ) : (
          <TrendingDown className={cn('w-4 h-4', designSystem.colors.text.errorLight, designSystem.spacing.margin.right.sm)} />
        )}
        <span className={cn(
          designSystem.typography.body.sm,
          designSystem.typography.weight.medium,
          trend === 'up' ? designSystem.colors.text.success : designSystem.colors.text.error
        )}>
          {change}
        </span>
        <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary, designSystem.spacing.margin.left.sm)}>
          from last month
        </span>
      </div>
    </div>
  );
}

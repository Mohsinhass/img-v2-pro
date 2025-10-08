import React from 'react';
import { usePlan } from '../../context/PlanContext';
import Button from '../ui/Button';

const PLAN_ORDER = ['free','plus','pro','enterprise'];

export default function PlanSwitcher() {
  const { planId, switchPlan } = usePlan();
  return (
    <div className="inline-flex items-center space-x-2 bg-muted rounded-lg p-2 text-xs">
      {PLAN_ORDER.map(p => (
        <Button
          key={p}
          size="sm"
          variant={planId === p ? 'default' : 'outline'}
          onClick={() => switchPlan(p)}
        >
          {p}
        </Button>
      ))}
    </div>
  );
}

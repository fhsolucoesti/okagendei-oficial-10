// Helper functions for plan management

export function planLimit(plan: string): number {
  const limits: Record<string, number> = {
    'basico': 1,
    'profissional': 5,
    'premium': 10
  };
  return limits[plan] ?? 1;
}

export function randomPassword(): string {
  return Math.random().toString(36).slice(-8);
}

export function getPlanDisplayName(plan: string): string {
  const names: Record<string, string> = {
    'basico': 'Básico',
    'profissional': 'Profissional',
    'premium': 'Premium'
  };
  return names[plan] ?? plan;
}
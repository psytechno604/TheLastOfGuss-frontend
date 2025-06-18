type ApiError = {
  status: number;
  message: string;
};

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let message = `${res.url}: Login failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {
      // fallback
    }
    throw { status: res.status, message } as ApiError;
  }
}
export async function getWhoAmI() {
  const res = await fetch('/api/auth/whoami');
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function getRounds() {
  const res = await fetch('/api/rounds');
  return res.json();
}
export async function createRound(data: { startAt: string }) {
  const res = await fetch('/api/rounds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create round');
  return res.json();
}

export async function getRound(id: string) {
  const res = await fetch(`/api/rounds/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch round ${id}`);
  return res.json();
}

export function getStatusName(status: string): string {
  switch (status) {
    case 'waiting':
      return 'Ожидание';
    case 'cooldown':
      return 'Ожидание перезарядки';
    case 'active':
      return 'Активный';
    case 'finished':
      return 'Завершён';
    default:
      return 'Неизвестный статус';
  }
}

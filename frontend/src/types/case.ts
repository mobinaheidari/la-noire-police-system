export interface Case {
    id: number;
    title: string;
    description: string;
    status: 'pending_cadet' | 'pending_officer' | 'open' | 'closed' | 'void';
    crime_scene_time: string;
    created_at: string;
  }
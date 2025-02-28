export interface NotificationModel {
    id: number;
    message: string;
    user_id: number;
    user_recieved:string;
    type: 'success' | 'error' | 'warning' | 'info';
}


export interface Visitor {
    id: number;
    ticket_number: string;
    name: string;
    amount: number;
    check_in_time: string;
    check_out_time: string;
    created_at: string;
    updated_at: string;
}

export interface VisitorHourly {
    hour: string;
    masuk: number;
    keluar: number;
}
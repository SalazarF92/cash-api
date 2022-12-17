import { TransactionProps } from "../types/interfaces";

export class Transaction {
    private props: TransactionProps;
    constructor(props: TransactionProps) {
        this.props = {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? new Date(),
        };
    }
    public get id(): string {
        return this.props.id;
    }
    public get amount(): number {
        return this.props.amount;
    }
    public set amount(value: number) {
        this.props.amount = value;
    }
    public get type(): string {
        return this.props.type;
    }
    public set type(value: string) {
        this.props.type = value;
    }
    public get description(): string {
        return this.props.description;
    }
    public set description(value: string) {
        this.props.description = value;
    }
    public get userId(): string {
        return this.props.userId;
    }
    public set userId(value: string) {
        this.props.userId = value;
    }
    // public get createdAt(): Date {
    //     return this.props.createdAt;
    // }
    // public get updatedAt(): Date {
    //     return this.props.updatedAt;
    // }
    // public get deletedAt(): Date | null | undefined {
    //     return this.props.deletedAt;
    // }
    // public get deleted(): boolean {
    //     return this.props.deleted;
    // }
    // public set deleted(value: boolean) {
    //     this.props.deleted = value;
    // }
    // public get active(): boolean {
    //     return this.props.active;
    // }
    // public set active(value: boolean) {
    //     this.props.active = value;
    // }
}
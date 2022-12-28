import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    UpdateDateColumn,
    Column,
    BeforeInsert,
  } from 'typeorm';
  import { v4 } from 'uuid';
  
  export class Base {
    @PrimaryColumn()
    id: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
  
    @Column({ default: false })
    deleted: boolean;
  
    @Column({ default: true })
    active: boolean;
  
    @BeforeInsert()
    generateId() {
      this.id = v4();
    }
  }
  
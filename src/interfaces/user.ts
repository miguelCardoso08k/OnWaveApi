export interface CreateUser {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   born: string;
   cpf: string;
   cellphone: string;
   role: string;
   unitId: string;
   adminId?: string;
   barbeshopId: string;
}

export interface CreateDev {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}

export interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   born: string;
   cpf: string;
   cellphone: string;
   role: string;
   unitId: string;
   adminId: string | null;
   barbeshopId: string;
   firstLogin: boolean;
}

export interface UserRepository {
   create(data: CreateDev): Promise<null | User>;
   getByEmail(data: { email: string }): Promise<null | User>;
   getById(id: string): Promise<null | User>;
   getByName(value: string): Promise<null | User[]>;
   getUsers(): Promise<null | User[]>;
   updateCellphone(data: { id: string; value: string }): Promise<null | User>;
   updatePassword(data: { id: string; value: string }): Promise<null | User>;
   delete(id: string): Promise<null | User>;
}

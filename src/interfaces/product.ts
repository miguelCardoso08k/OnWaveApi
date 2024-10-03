export interface CreateProduct{
    userId: string
    name: string
    weight: number
    nameWeight: string
    cost : number
    price : number
    describe : string |null
    workTop: boolean
    barbershopId: string
}


export interface Product extends CreateProduct{
    id:string
}


export interface ProductRepository{
    create(data: CreateProduct):Promise<null| Product>
    getAll():Promise<null| Product[]>
    getByName(name: string):Promise<null| Product[]>
    getById(id: string):Promise<null| Product>
    updateName(data:{id: string,value: string}):Promise<null| Product>
    updateNameWeight(data:{id: string,value: string}):Promise<null| Product>
    updateDescribe(data:{id: string,value: string}):Promise<null| Product>
    updateWeight(data:{id: string,value: number}): Promise<null | Product>
    updatePrice(data:{id: string,value: number}): Promise<null | Product>
    updateCost(data:{id: string,value: number}): Promise<null | Product>
    updateWorktop(data:{id: string,value: boolean}): Promise<null | Product>
    delete(id: string):Promise<null| Product>
}
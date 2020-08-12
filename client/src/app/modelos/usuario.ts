export class Usuario{
	constructor(
		public _id: string, 
		public nombre: string, 
		public apellidos: string, 
		public email: string, 
		public contrasenya: string, 
		public rol: string, 
		public imagen: string
	){}
}

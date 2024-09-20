export class DoctorModel {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  fullName: string = '';
  //department: any="";
  department: DepartmentModel = new DepartmentModel();
  departmentValue:number= 0
}

export class DepartmentModel{
    value:number = 0;
    name:string ="";
}

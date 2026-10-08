export type Role='admin'|'user';
export interface Actor {id:string;name:string;email:string;role:Role;org_id:string;org_name:string;org_kind:string}
export interface Organization {id:string;code:string;name:string;kind:string;region:string;active:number}
export interface User {id:string;name:string;email:string;role:Role;org_id:string;org_name:string;active:number}
export interface Domain {id:string;code:string;name:string;description:string}
export interface Location {id:string;code:string;name:string;region:string;domain_id:string;description:string;active:number;org_ids:string[]}
export interface Indicator {id:string;code:string;name:string;unit:string;domain_id:string;definition:string;frequency:string;active:number}
export interface Audit {id:string;action:string;entity:string;summary:string;created_at:number;actor_name:string}
export interface Bootstrap {actor:Actor;organizations:Organization[];users:User[];domains:Domain[];locations:Location[];indicators:Indicator[];audits:Audit[]}
export type Resource='organizations'|'users'|'locations'|'indicators';
export type MasterRecord=Organization|User|Location|Indicator;

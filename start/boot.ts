import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import CamelCaseNamingStrategy from 'App/Helpers/CamelCaseNamingStrategy';

BaseModel.namingStrategy = new CamelCaseNamingStrategy();

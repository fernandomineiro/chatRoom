import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Preference } from './interface';

@Injectable({
    providedIn: 'root'
})

export class PreferencesService {

    constructor(private api: ApiService) { }
 
    async list() : Promise<Preference[]> {
        try {
            const list: Preference[] = await this.api.get('preferences').toPromise() as any
            return list
        } catch (error) {
            return []            
        }
    }

    async details(id) : Promise<Preference> {
        try {
            const preference: Preference = await this.api.get('preferences/'+id).toPromise() as any
            return preference
        } catch (error) {
            throw error
        }
    }
}
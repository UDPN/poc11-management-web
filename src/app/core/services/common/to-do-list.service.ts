import { ChangeDetectorRef, HostListener, Injectable, OnDestroy } from '@angular/core';
import { PocHomeService } from '../http/poc-home/poc-home.service';
import { finalize, interval, switchMap, take } from 'rxjs';
import { WindowService } from './window.service';
import { toDoListLength } from '@app/config/constant';
@Injectable({
    providedIn: 'root'
})
export class ToDoListService {
    constructor(private pocHomeService: PocHomeService, private windowSer: WindowService) { }

    getToDoListLength(): void {
        this.pocHomeService.getList(1, 500)
            .subscribe(
                (res: any) => {
                    this.windowSer.setSessionStorage(toDoListLength, res.resultPageInfo.total);
                }
            );
        // interval(5000)
        //     .pipe(
        //         switchMap((a) => {
        //             return sessionStorage.getItem('clientName') ? this.pocHomeService.getList(1, 500) : '';
        //         }),
        //     )
        //     .subscribe(
        //         (res: any) => {
        //             this.windowSer.setSessionStorage(toDoListLength, res.resultPageInfo.total);
        //         }
        //     );

    }
}

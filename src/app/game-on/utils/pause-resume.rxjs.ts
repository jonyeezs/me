import { filter, mergeAll, Observable, startWith, windowToggle } from "rxjs";
import { ControllerService } from "../services/controller/controller.service";

export function pauseResume(controller: ControllerService) {
    return function <T>(source: Observable<T>) {
        return source.pipe(
            windowToggle(
                controller.playStateChange().pipe(startWith('resume'), filter(p => p === 'resume')),
                () => controller.playStateChange().pipe(filter(p => p === 'pause'))),
            mergeAll()
        );
    };
}

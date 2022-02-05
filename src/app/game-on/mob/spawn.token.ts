export abstract class SpawnCommunicator {
    /**
     * Tells the spawn that you're completed your job
     * 
     * @argument callCard - provide your given mob name
     */
    abstract done(callCard: string): void;
}
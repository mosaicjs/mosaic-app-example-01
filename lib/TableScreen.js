import { AppModule } from 'mosaic-app';

export default class TableScreen extends AppModule {
    activate(params) {
        var data = [['Column A', 'Column B', 'Column C'], ['1', '2', '3']];
        var container = document.querySelector('body');
        console.log('admin activation', container, data);
    }
    update(params) {
        console.log('admin update', params);
    }
    deactivate(params) {
        console.log('admin deactivation', params);
    }
}
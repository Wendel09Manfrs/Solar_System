import {LoadingManager} from 'three'

export class Loading {
    constructor() {
            this.loadingManager = new LoadingManager();

            this.progressBar = document.getElementById('progress-bar');   

            this.loadingManager.onProgress = function(url, loaded, total) {
                this.progressBar.value = (loaded / total) * 100;
            }.bind(this);

            this.progressBarContainer = document.querySelector('.progress-bar-container'); 

            this.loadingManager.onLoad = function() {
                this.progressBarContainer.style.display = 'none';
            }.bind(this);
        
    }
}



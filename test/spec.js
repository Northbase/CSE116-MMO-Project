const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

this.app = new Application({
            // Your electron path can be any binary
            // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
            // But for the sake of the example we fetch it from our node_modules.
            path: electronPath,

            // Assuming you have the following directory structure

            //  |__ my project
            //     |__ ...
            //     |__ main.js
            //     |__ package.json
            //     |__ game.html
            //     |__ ...
            //     |__ test
            //        |__ spec.js  <- You are here! ~ Well you should be.

            // The following line tells spectron to look and use the main.js file
            // and the package.json located 1 level above.
            args: [path.join(__dirname, '..')]
        });

app.start().then(function () {
    // Check if the window is visible
    return app.browserWindow.isVisible()
}).then(function (isVisible) {
    // Verify the window is visible
    assert.equal(isVisible, true)
}).then(function () {
    // Get the window's title
    return app.client.getTitle()
}).then(function (title) {
    // Verify the window's title
    assert.equal(title, 'My App')
}).then(function () {
    // Stop the application
    return app.stop()
}).catch(function (error) {
    // Log any failures
    console.error('Test failed', error.message)
});



// describe('Application launch', function () {
//     this.timeout(10000);
//
//     beforeEach(function () {
//         this.app = new Application({
//             // Your electron path can be any binary
//             // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
//             // But for the sake of the example we fetch it from our node_modules.
//             path: electronPath,
//
//             // Assuming you have the following directory structure
//
//             //  |__ my project
//             //     |__ ...
//             //     |__ main.js
//             //     |__ package.json
//             //     |__ game.html
//             //     |__ ...
//             //     |__ test
//             //        |__ spec.js  <- You are here! ~ Well you should be.
//
//             // The following line tells spectron to look and use the main.js file
//             // and the package.json located 1 level above.
//             args: [path.join(__dirname, '..')]
//         });
//         return this.app.start()
//     });
//
//     afterEach(function () {
//         if (this.app && this.app.isRunning()) {
//             return this.app.stop()
//         }
//     });
//
//     it('shows an initial window', function () {
//         return this.app.client.getWindowCount().then(function (count) {
//             assert.equal(count, 1)
//             // Please note that getWindowCount() will return 2 if `dev tools` are opened.
//             // assert.equal(count, 2)
//         })
//     })
// });

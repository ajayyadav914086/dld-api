var ShortCuts = require("../models/shortcuts.model")
export class ShortCodes {
    searchArray: any
    async getWordsFromShortCode(search: String) {
        this.searchArray = search.split(" ")
        var tempArray = this.searchArray
        for (var i = 0; i < this.searchArray.length; i++) {
            await this.findShortCode(i)
        }
        console.log("outside", this.searchArray.join(" "))
        return this.searchArray.join(" ");
    }

    async findShortCode(i: any) {
        await ShortCuts.findOne({ shortcut: this.searchArray[i] }).then((result: any) => {
            if (result) {
                this.searchArray[i] = result.word
                console.log("inside", result.word)
            }
        })
    }
}
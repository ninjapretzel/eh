// Quickdraw, because sometimes you want to just process all js files in a directory.

const fs = require("fs");
const path = require("path");

/** @callback quickdrawFilter
@param {string} path - File path to filter
@returns {boolean} True if included, false if excluded */
/** Recursively load all files from a given base point.
@param {string} base - Initial path to load from
@param {quickdrawFilter} filter - Filter to select files to include */
function allFiles(base, filter=any) {
	function recurse(pth, cache, filter) {
		const content = fs.readdirSync(pth);
		
		for (let i = 0; i < content.length; i++) {
			const pth2 = content[i];
			const absPath = path.join(pth, pth2);
			const relPath = absPath.replace(base, "");
			
			if (fs.statSync( absPath ).isDirectory()) {
				recurse(absPath, cache, filter);
			} else if (filter(pth2)) {
				cache.push(relPath);
			}
		}
		return cache;
	}
	
	return recurse(base, [], filter);
} 

/** Dead simple filter function for always passing. */
function any() { return true; }

/** @callback quickdrawCallback
@param {any} loaded - Content loaded from module (null if failed)
@param {string} path - relative path from srcfile
@param {error} err - generated err (undefined if successful) */

/** Load other js files in the same directory as a source file, 
and process all files with a given callback procedure.
@param {string} srcfile - The first source file to load
@param {quickdrawCallback} proc - Callback to use to process files. */
function quickdraw(srcfile, proc) {
	const basename = path.basename(srcfile);
	const dirname = path.dirname(srcfile) + path.sep;
	
	function isJs(file) {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	}
	// console.log(`Quickdraw for ${dirname}`);
	
	allFiles(dirname, isJs)
		.forEach(file => {
			// console.log(`Before, file=[${file}]`)
			file = file.replace(/\\/g, "/").replace('.js','');
			// console.log(`After, file=[${file}]`)
			try {
				const loaded = require(path.join(dirname, file));
				proc(loaded, file);
			} catch (err) {
				proc(null, file, err);
			}
		});
}

quickdraw.allFiles = allFiles;
quickdraw.any = any;

module.exports = quickdraw

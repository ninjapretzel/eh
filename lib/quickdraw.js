// Quickdraw, because sometimes you want to just process all js files in a directory.

const fs = require("fs");
const path = require("path");

function any() { return true; }

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

function loadFiles(srcfile, proc) {

	const basename = path.basename(srcfile);
	const dirname = path.dirname(srcfile);
	
	function isJs(file) {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	}
	
	allFiles(dirname, isJs)
		.forEach(file => {
			file = file.replace(/\\/g, "/").replace('.js','');
			try {
				const loaded = require(path.join(dirname, file));
				proc(loaded, file);
			} catch (err) {
				proc(null, file, err);
			}
		});
}

loadFiles.allFiles = allFiles;
loadFiles.any = any;



module.exports = loadFiles

import glob

with open('start.js', 'w') as fileMerge:
	fileMerge.write("'use strict';\n\n")

	for filename in glob.glob('../src/*.js'):
		with open(filename) as fileScript:
			fileMerge.write(fileScript.read() + '\n')

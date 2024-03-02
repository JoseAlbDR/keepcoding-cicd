import * as shell from 'shelljs';

// Copy all the view templates
shell.cp('-R', 'src/presentation/web/views', 'dist/presentation/web/views');
// shell.cp('-R', 'src/presentation/locales', 'dist/presentation/locales');

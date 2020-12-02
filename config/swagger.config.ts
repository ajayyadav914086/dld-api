import { Doc, DocBuilder } from 'doctopus';
import UserRoute from '../routes/user.route';
const docs = new DocBuilder();
const docFactory = new Doc();
docs.set('title', 'DLD API Documation');
docs.set('version', '1.1.8');
docs.set('description', 'DLD RESTful API with Docs');
docs.set('basePath', '/');
docs.add('/swagger', docFactory.get()
    .group('Documentation')
    .description('Gets a Swagger Specification')
    .summary('Swagger')
    .onSuccess(200, {
        description: 'Swagger Spec',
        schema: Doc.object()
    })
    .build());
docs.use(UserRoute);
// Imports routes
exports.swaggerJson = function (req: any, res: any) {
    res.send(docs.build());
}
exports.swagger = function (req: any, res: any) {
    res.redirect('/api-docs/index.html');
}

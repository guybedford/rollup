"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayExpression_1 = require("./ArrayExpression");
var ArrayPattern_1 = require("./ArrayPattern");
var ArrowFunctionExpression_1 = require("./ArrowFunctionExpression");
var AssignmentExpression_1 = require("./AssignmentExpression");
var AssignmentPattern_1 = require("./AssignmentPattern");
var AwaitExpression_1 = require("./AwaitExpression");
var BinaryExpression_1 = require("./BinaryExpression");
var BlockStatement_1 = require("./BlockStatement");
var BreakStatement_1 = require("./BreakStatement");
var CallExpression_1 = require("./CallExpression");
var CatchClause_1 = require("./CatchClause");
var ClassBody_1 = require("./ClassBody");
var ClassDeclaration_1 = require("./ClassDeclaration");
var ClassExpression_1 = require("./ClassExpression");
var ConditionalExpression_1 = require("./ConditionalExpression");
var DoWhileStatement_1 = require("./DoWhileStatement");
var EmptyStatement_1 = require("./EmptyStatement");
var ExportAllDeclaration_1 = require("./ExportAllDeclaration");
var ExportDefaultDeclaration_1 = require("./ExportDefaultDeclaration");
var ExportNamedDeclaration_1 = require("./ExportNamedDeclaration");
var ExpressionStatement_1 = require("./ExpressionStatement");
var ForStatement_1 = require("./ForStatement");
var ForInStatement_1 = require("./ForInStatement");
var ForOfStatement_1 = require("./ForOfStatement");
var FunctionDeclaration_1 = require("./FunctionDeclaration");
var FunctionExpression_1 = require("./FunctionExpression");
var Identifier_1 = require("./Identifier");
var IfStatement_1 = require("./IfStatement");
var Import_1 = require("./Import");
var ImportDeclaration_1 = require("./ImportDeclaration");
var LabeledStatement_1 = require("./LabeledStatement");
var Literal_1 = require("./Literal");
var LogicalExpression_1 = require("./LogicalExpression");
var MemberExpression_1 = require("./MemberExpression");
var MethodDefinition_1 = require("./MethodDefinition");
var NewExpression_1 = require("./NewExpression");
var ObjectExpression_1 = require("./ObjectExpression");
var ObjectPattern_1 = require("./ObjectPattern");
var Property_1 = require("./Property");
var RestElement_1 = require("./RestElement");
var ReturnStatement_1 = require("./ReturnStatement");
var SequenceExpression_1 = require("./SequenceExpression");
var SwitchCase_1 = require("./SwitchCase");
var SwitchStatement_1 = require("./SwitchStatement");
var TaggedTemplateExpression_1 = require("./TaggedTemplateExpression");
var TemplateElement_1 = require("./TemplateElement");
var TemplateLiteral_1 = require("./TemplateLiteral");
var ThisExpression_1 = require("./ThisExpression");
var ThrowStatement_1 = require("./ThrowStatement");
var UnaryExpression_1 = require("./UnaryExpression");
var UpdateExpression_1 = require("./UpdateExpression");
var VariableDeclarator_1 = require("./VariableDeclarator");
var VariableDeclaration_1 = require("./VariableDeclaration");
var WhileStatement_1 = require("./WhileStatement");
var YieldExpression_1 = require("./YieldExpression");
var Statement_1 = require("./shared/Statement");
var nodes = {
    ArrayExpression: ArrayExpression_1.default,
    ArrayPattern: ArrayPattern_1.default,
    ArrowFunctionExpression: ArrowFunctionExpression_1.default,
    AssignmentExpression: AssignmentExpression_1.default,
    AssignmentPattern: AssignmentPattern_1.default,
    AwaitExpression: AwaitExpression_1.default,
    BinaryExpression: BinaryExpression_1.default,
    BlockStatement: BlockStatement_1.default,
    BreakStatement: BreakStatement_1.default,
    CallExpression: CallExpression_1.default,
    CatchClause: CatchClause_1.default,
    ClassBody: ClassBody_1.default,
    ClassDeclaration: ClassDeclaration_1.default,
    ClassExpression: ClassExpression_1.default,
    ConditionalExpression: ConditionalExpression_1.default,
    DoWhileStatement: DoWhileStatement_1.default,
    EmptyStatement: EmptyStatement_1.default,
    ExportAllDeclaration: ExportAllDeclaration_1.default,
    ExportDefaultDeclaration: ExportDefaultDeclaration_1.default,
    ExportNamedDeclaration: ExportNamedDeclaration_1.default,
    ExpressionStatement: ExpressionStatement_1.default,
    ForStatement: ForStatement_1.default,
    ForInStatement: ForInStatement_1.default,
    ForOfStatement: ForOfStatement_1.default,
    FunctionDeclaration: FunctionDeclaration_1.default,
    FunctionExpression: FunctionExpression_1.default,
    Identifier: Identifier_1.default,
    IfStatement: IfStatement_1.default,
    Import: Import_1.default,
    ImportDeclaration: ImportDeclaration_1.default,
    LabeledStatement: LabeledStatement_1.default,
    Literal: Literal_1.default,
    LogicalExpression: LogicalExpression_1.default,
    MemberExpression: MemberExpression_1.default,
    MethodDefinition: MethodDefinition_1.default,
    NewExpression: NewExpression_1.default,
    ObjectExpression: ObjectExpression_1.default,
    ObjectPattern: ObjectPattern_1.default,
    Property: Property_1.default,
    RestElement: RestElement_1.default,
    ReturnStatement: ReturnStatement_1.default,
    SequenceExpression: SequenceExpression_1.default,
    SwitchCase: SwitchCase_1.default,
    SwitchStatement: SwitchStatement_1.default,
    TaggedTemplateExpression: TaggedTemplateExpression_1.default,
    TemplateElement: TemplateElement_1.default,
    TemplateLiteral: TemplateLiteral_1.default,
    ThisExpression: ThisExpression_1.default,
    ThrowStatement: ThrowStatement_1.default,
    TryStatement: Statement_1.StatementBase,
    UnaryExpression: UnaryExpression_1.default,
    UpdateExpression: UpdateExpression_1.default,
    VariableDeclarator: VariableDeclarator_1.default,
    VariableDeclaration: VariableDeclaration_1.default,
    WhileStatement: WhileStatement_1.default,
    YieldExpression: YieldExpression_1.default
};
exports.default = nodes;

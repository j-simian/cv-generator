"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var fs_2 = require("fs");
var latex = require("node-latex");
function generatePDF(dataFile, outputFile, texOut) {
    return __awaiter(this, void 0, void 0, function () {
        var rawData, built, input, output, pdf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseJSONFile("./data/" + dataFile)];
                case 1:
                    rawData = _a.sent();
                    built = "";
                    // LATEX HEADER
                    built += "\\documentclass{res}\n";
                    built += "\n";
                    built +=
                        "\\setlength{\\topmargin}{-0.6in}  % Start text higher on the page \n";
                    built +=
                        "\\setlength{\\textheight}{9.8in}  % increase textheight to fit more on a page\n";
                    built +=
                        "\\setlength{\\headsep}{0.2in}     % space between header and text\n";
                    built += "\\setlength{\\headheight}{12pt}   % make room for header\n";
                    built +=
                        "\\usepackage{fancyhdr}  % use fancyhdr package to get 2-line header\n";
                    built += "\\usepackage[a4paper, total={7in, 10.5in}]{geometry}\n";
                    built +=
                        "\\setlength{\\leftmargin}{-0.6in}  % Start text higher on the page \n";
                    built +=
                        "\\renewcommand{\\headrulewidth}{0pt} % suppress line drawn by default by fancyhdr\n";
                    built += "\\cfoot{}  % the footer is empty\n";
                    built += "\\pagestyle{fancy} % set pagestyle for the document\n";
                    built += "\n";
                    built += "\\begin{document}\n";
                    // DOCUMENT HEADER
                    built += "\\name{".concat(rawData.name.toUpperCase(), "}\n");
                    built += "\\begin{resume}\n";
                    built += "\\centerline{".concat(rawData.contact.phone, " -- ").concat(rawData.contact.email, "}\n");
                    built += "\\centerline{".concat(rawData.websites.join(" -- "), "}\n");
                    built += "\n";
                    Object.keys(rawData.sections).forEach(function (section) {
                        built += buildSection(section, rawData.sections[section]);
                    });
                    built += "\\end{resume}\n";
                    built += "\\end{document}\n";
                    // Output
                    fs_1.promises.writeFile("./out/".concat(outputFile, ".tex"), built);
                    input = (0, fs_2.createReadStream)("./out/".concat(outputFile, ".tex"));
                    output = (0, fs_2.createWriteStream)("./out/".concat(outputFile, ".pdf"));
                    pdf = latex(input, {
                        precompiled: "./ltx"
                    });
                    pdf.pipe(output);
                    pdf.on("error", function (err) { return console.error(err); });
                    pdf.on("finish", function () {
                        console.log("PDF created!");
                        if (!texOut)
                            (0, fs_2.unlink)("./out/".concat(outputFile, ".tex"), function (err) {
                                if (err)
                                    console.error(err);
                            });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function buildSection(name, data) {
    var built = "\n";
    built += "\\noindent\\makebox[\\linewidth]{\\rule{18cm}{0.4pt}}\n";
    built += "\\section{".concat(name.toUpperCase(), "}\n");
    built += "\\vspace{0.05in}\n";
    data.forEach(function (item) {
        built += "\\textbf{".concat(item.pre, "}");
        if (item.post) {
            built += " \\textbullet \\space ".concat(item.post);
        }
        if (item.date) {
            built += " \\hfill ".concat(item.date);
        }
        built += "\n";
        if (item.bullets) {
            built += "\\begin{itemize}\n";
            item.bullets.forEach(function (bullet) {
                built += "\t\\item ".concat(bullet, "\n");
            });
            built += "\\end{itemize}\n";
        }
    });
    return built;
}
function parseJSONFile(inFile) {
    return __awaiter(this, void 0, void 0, function () {
        var text, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(inFile, "utf-8")];
                case 1:
                    text = _a.sent();
                    data = JSON.parse(text);
                    return [2 /*return*/, data];
            }
        });
    });
}
function main() {
    var dataFile = "cv.json";
    var outputFile = "cv";
    var texOut = false;
    process.argv.forEach(function (arg, index) {
        if (index <= 1)
            return;
        if (arg.startsWith("--dataFile=")) {
            dataFile = arg.slice(11);
        }
        else if (arg.startsWith("--outputFile=")) {
            outputFile = arg.slice(13);
        }
        else if (arg === "--texOut") {
            texOut = true;
        }
        else {
            console.log("Usage: node index.js [...args]");
            console.log("\t--dataFile=<dataFile>.json \t\t The file to get the input data from");
            console.log("\t--outputFile=<outputFile> \t\t The file to output to, with no extension");
            process.exit(-1);
        }
    });
    generatePDF(dataFile, outputFile, texOut);
}
main();

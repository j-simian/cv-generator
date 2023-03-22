import { promises as fs } from "fs";
import { createReadStream, createWriteStream, unlink } from "fs";
const latex = require("node-latex");

type Section = {
  pre: string;
  post?: string;
  date?: string;
  bullets?: [string];
};

type CVData = {
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  websites: [string];
  sections: { [name: string]: [Section] };
  // education: [Section];
  // experience: [Section];
  // awards: [Section];
  // projects: [Section];
};

async function generatePDF(
  dataFile: string,
  outputFile: string,
  texOut: boolean
) {
  const rawData: CVData = await parseJSONFile("./data/" + dataFile);

  var built = "";

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
  built += `\\name{${rawData.name.toUpperCase()}}\n`;
  built += "\\begin{resume}\n";
  built += `\\centerline{${rawData.contact.phone} -- ${rawData.contact.email}}\n`;
  built += `\\centerline{${rawData.websites.join(" -- ")}}\n`;

  built += "\n";

  Object.keys(rawData.sections).forEach((section) => {
    built += buildSection(section, rawData.sections[section]);
  });

  built += "\\end{resume}\n";
  built += "\\end{document}\n";

  // Output
  fs.writeFile(`./out/${outputFile}.tex`, built);
  const input = createReadStream(`./out/${outputFile}.tex`);
  const output = createWriteStream(`./out/${outputFile}.pdf`);
  const pdf = latex(input, {
    precompiled: "./ltx",
  });
  pdf.pipe(output);
  pdf.on("error", (err: string) => console.error(err));
  pdf.on("finish", () => {
    console.log("PDF created!");
    if (!texOut)
      unlink(`./out/${outputFile}.tex`, (err) => {
        if (err) console.error(err);
      });
  });
}

function buildSection(name: string, data: [Section]) {
  let built = "\n";
  built += "\\noindent\\makebox[\\linewidth]{\\rule{18cm}{0.4pt}}\n";
  built += `\\section{${name.toUpperCase()}}\n`;
  built += `\\vspace{0.05in}\n`;
  data.forEach((item: Section) => {
    built += `\\textbf{${item.pre}}`;
    if (item.post) {
      built += ` \\textbullet \\space ${item.post}`;
    }
    if (item.date) {
      built += ` \\hfill ${item.date}`;
    }
    built += "\n";
    if (item.bullets) {
      built += "\\begin{itemize}\n";
      item.bullets.forEach((bullet) => {
        built += `\t\\item ${bullet}\n`;
      });
      built += "\\end{itemize}\n";
    }
  });
  return built;
}

async function parseJSONFile(inFile: string) {
  const text = await fs.readFile(inFile, "utf-8");
  const data = JSON.parse(text);
  return data;
}

function main() {
  let dataFile = "cv.json";
  let outputFile = "cv";
  let texOut = false;
  process.argv.forEach((arg, index) => {
    if (index <= 1) return;
    if (arg.startsWith("--dataFile=")) {
      dataFile = arg.slice(11);
    } else if (arg.startsWith("--outputFile=")) {
      outputFile = arg.slice(13);
    } else if (arg === "--texOut") {
      texOut = true;
    } else {
      console.log("Usage: node index.js [...args]");
      console.log(
        "\t--dataFile=<dataFile>.json \t\t The file to get the input data from"
      );
      console.log(
        "\t--outputFile=<outputFile> \t\t The file to output to, with no extension"
      );
      process.exit(-1);
    }
  });
  generatePDF(dataFile, outputFile, texOut);
}

main();

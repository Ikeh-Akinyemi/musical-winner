const PDFDocument = require('pdfkit');
const { jsPDF } = require('jspdf');
const htmlPdf = require('html-pdf-node');
const { PDFDocument: PDFLib } = require('pdf-lib');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { performance } = require('node:perf_hooks');
const os = require('os');
const path = require('path');

// Additional packages
const PDFMake = require('pdfmake');
const pdfkit = require('pdfkit-table');  // Enhanced version of PDFKit with table support

class EnhancedPDFBenchmark {
    constructor() {
        this.results = {
            pdfkit: { times: [], memory: [], errors: 0 },
            pdfkitTable: { times: [], memory: [], errors: 0 },
            jspdf: { times: [], memory: [], errors: 0 },
            htmlPdfNode: { times: [], memory: [], errors: 0 },
            pdfLib: { times: [], memory: [], errors: 0 },
            pdfmake: { times: [], memory: [], errors: 0 },
            puppeteer: { times: [], memory: [], errors: 0 }
        };
        this.setupOutputDirectories();
    }

    setupOutputDirectories() {
        const packages = Object.keys(this.results);
        const baseDir = path.join(__dirname, 'output');

        // Create base output directory if it doesn't exist
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir);
        }

        packages.forEach(pkg => {
            const dir = path.join(baseDir, pkg.toLowerCase());
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
    }

    getComplexHTML() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .name {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .contact {
                    margin-bottom: 20px;
                }
                .contact a {
                    color: #2962ff;
                    text-decoration: none;
                    margin: 0 10px;
                }
                .section {
                    margin-bottom: 20px;
                }
                .section-title {
                    font-size: 20px;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-bottom: 2px solid #333;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                }
                .skills {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 10px;
                }
                .experience-item {
                    margin-bottom: 15px;
                }
                .job-title {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                }
                .company-details {
                    display: flex;
                    justify-content: space-between;
                    font-style: italic;
                    color: #666;
                    margin-bottom: 5px;
                }
                ul {
                    margin-left: 20px;
                }
                li {
                    margin-bottom: 5px;
                }
                .project {
                    margin-bottom: 15px;
                }
                .project-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="name">Ikeh Chukwuka</div>
                <div class="contact">
                    <a href="mailto:mrikehchukwuka@gmail.com">mrikehchukwuka@gmail.com</a> |
                    <a href="https://www.linkedin.com/in/ikeh-chukwuka/">linkedin.com/in/ikeh-chukwuka</a> |
                    <a href="https://github.com/IkehAkinyemi">github.com/IkehAkinyemi</a>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Technical Skills</div>
                <div class="skills">
                    <strong>Languages:</strong>
                    <span>Go, Python, Rust, TypeScript, JavaScript, SQL</span>
                    <strong>Databases:</strong>
                    <span>PostgreSQL, MySQL, MongoDB, Redis</span>
                    <strong>Developer Tools:</strong>
                    <span>Git, Docker, Ubuntu, AWS, GitHub Actions</span>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Experience</div>
                
                <div class="experience-item">
                    <div class="job-title">
                        <span>Software Engineer</span>
                        <span>Jan. 2022 -- Aug. 2024</span>
                    </div>
                    <div class="company-details">
                        <span>Drawstring.io</span>
                        <span>New York, NY</span>
                    </div>
                    <ul>
                        <li>Contributed to team building NFT marketplace backend using Go, implementing custom order matching engine processing 5K+ monthly trades</li>
                        <li>Collaborated on redesigning notification service using observer pattern, scaling to handle 200+ concurrent websocket connections with automated reconnection strategies</li>
                        <li>Helped implement distributed caching layer using Redis for product metadata, reducing average API response time from 300ms to 50ms while maintaining data consistency</li>
                        <li>Worked with team to develop automated product sync system, handling real-time updates across multiple blockchain networks</li>
                    </ul>
                </div>

                <div class="experience-item">
                    <div class="job-title">
                        <span>Backend Engineer</span>
                        <span>Aug. 2021 -- Dec. 2021</span>
                    </div>
                    <div class="company-details">
                        <span>StoreHub</span>
                        <span>Lagos, NG</span>
                    </div>
                    <ul>
                        <li>Single-handedly built ecommerce platform backend using Go and Node.js, implementing complex features like multi-vendor support and customizable storefront</li>
                        <li>Engineered inventory management system using PostgreSQL for real-time stock tracking, handling 10K+ daily SKU updates with custom aggregation pipelines</li>
                        <li>Developed store analytics service using Node.js streams for tracking each store performance</li>
                        <li>Implemented store co-ownership system with custom role-based access control, enabling store owners to seamlessly onboard business partners</li>
                    </ul>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Projects</div>
                
                <div class="project">
                    <div class="project-header">
                        <span>Audit log service | Go, RabbitMQ, PostgreSQL</span>
                        <a href="https://github.com/IkehAkinyemi/audit-log-service">Source code</a>
                    </div>
                    <ul>
                        <li>Built distributed logging service with custom aggregation logic and retention policies, using write-ahead logging for durability</li>
                    </ul>
                </div>

                <div class="project">
                    <div class="project-header">
                        <span>E-commerce API | Go, Redis</span>
                        <a href="https://github.com/IkehAkinyemi/DNSimple-CLI">Source code</a>
                    </div>
                    <ul>
                        <li>Developed CLI tool for DNS record management supporting custom filtering and bulk operations, handling 100+ zones efficiently</li>
                    </ul>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Education</div>
                <div class="experience-item">
                    <div class="job-title">
                        <span>University of Port Harcourt</span>
                        <span>Nov. 2018 -- Dec 2023</span>
                    </div>
                    <div class="company-details">
                        <span>Bachelor of Science in Mathematics (Pure and Applied)</span>
                        <span>Rivers, NG</span>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }

    async generateWithPDFKit(outputPath) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(outputPath);
                doc.pipe(stream);

                // Header
                doc.fontSize(24).text('Ikeh Chukwuka', { align: 'center' });
                doc.moveDown(0.5);
                doc.fontSize(12).text('mrikehchukwuka@gmail.com | github.com/IkehAkinyemi', { align: 'center' });

                // Add remaining content with proper formatting...
                // (Additional PDF generation code would go here)

                doc.end();
                stream.on('finish', resolve);
                stream.on('error', reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateWithPuppeteer(htmlContent, outputPath) {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({
            path: outputPath,
            format: 'A4',
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
            printBackground: true
        });
        await browser.close();
    }

    // Additional package implementations would go here...

    // Add this helper function at the class level
    async ensureDirectoryExists(dirPath) {
        try {
            await fs.promises.mkdir(dirPath, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    // Modify the benchmark method to ensure directories exist before running generators
    async benchmark(iterations = 3) {
        console.log('Starting Enhanced PDF Generation Benchmark...');
        console.log(`System Info:\nNode Version: ${process.version}\nCPU: ${os.cpus()[0].model}\nTotal Memory: ${Math.round(os.totalmem() / 1024 / 1024)}MB\n`);

        const htmlContent = this.getComplexHTML();

        const generators = [
            {
                name: 'PDFKit',
                fn: async (outputPath) => this.generateWithPDFKit(outputPath),
                results: this.results.pdfkit
            },
            {
                name: 'JSPDF',
                fn: async (outputPath) => {
                    const doc = new jsPDF();
                    doc.setFontSize(24);
                    doc.text('Ikeh Chukwuka', 105, 20, { align: 'center' });
                    fs.writeFileSync(outputPath, doc.output());
                },
                results: this.results.jspdf
            },
            {
                name: 'HTML-PDF-Node',
                fn: async (outputPath) => {
                    const options = { format: 'A4' };
                    const file = { content: htmlContent };
                    const buffer = await htmlPdf.generatePdf(file, options);
                    fs.writeFileSync(outputPath, buffer);
                },
                results: this.results.htmlPdfNode
            },
            {
                name: 'PDF-Lib',
                fn: async (outputPath) => {
                    const doc = await PDFLib.create();
                    const page = doc.addPage();
                    const { height } = page.getSize();
                    page.drawText('Ikeh Chukwuka', {
                        x: 50,
                        y: height - 50,
                        size: 24
                    });
                    const pdfBytes = await doc.save();
                    fs.writeFileSync(outputPath, pdfBytes);
                },
                results: this.results.pdfLib
            },
            {
                name: 'PDFKit-Table',
                fn: async (outputPath) => {
                    return new Promise((resolve, reject) => {
                        const doc = new pdfkit({ margin: 50 });
                        const stream = fs.createWriteStream(outputPath);
                        doc.pipe(stream);
                        doc.fontSize(24).text('Ikeh Chukwuka', { align: 'center' });
                        doc.end();
                        stream.on('finish', resolve);
                        stream.on('error', reject);
                    });
                },
                results: this.results.pdfkitTable
            },
            {
                name: 'Puppeteer',
                fn: async (outputPath) => this.generateWithPuppeteer(htmlContent, outputPath),
                results: this.results.puppeteer
            }
        ];

        for (const generator of generators) {
            console.log(`\nTesting ${generator.name}:`);
            // Ensure directory exists before running generator
            const dirPath = path.join(__dirname, 'output', generator.name.toLowerCase());
            await this.ensureDirectoryExists(dirPath);

            for (let i = 0; i < iterations; i++) {
                const outputPath = path.join(dirPath, `cv_${i + 1}.pdf`);
                const startTime = performance.now();
                const startMemory = process.memoryUsage();

                try {
                    await generator.fn(outputPath);
                    const endTime = performance.now();
                    const endMemory = process.memoryUsage();

                    generator.results.times.push(endTime - startTime);
                    generator.results.memory.push({
                        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                        external: endMemory.external - startMemory.external
                    });
                    process.stdout.write('✓');
                } catch (error) {
                    generator.results.errors++;
                    process.stdout.write('✗');
                    console.error(`\nError with ${generator.name}:`, error.message);
                }
            }
        }

        this.printResults();
    }

    printResults() {
        console.log('\nBenchmark Results:');
        console.log('------------------');

        Object.entries(this.results).forEach(([packageName, data]) => {
            if (data.times.length === 0) return;

            const avgTime = data.times.reduce((a, b) => a + b, 0) / data.times.length;
            const avgMemory = data.memory.reduce((a, b) => ({
                heapUsed: a.heapUsed + b.heapUsed,
                external: a.external + b.external
            }), { heapUsed: 0, external: 0 });

            console.log(`\n${packageName}:`);
            console.log(`Success Rate: ${((data.times.length / (data.times.length + data.errors)) * 100).toFixed(2)}%`);
            console.log(`Average Time: ${avgTime.toFixed(2)}ms`);
            console.log(`Average Memory Usage:`);
            console.log(`  Heap: ${(avgMemory.heapUsed / data.memory.length / 1024 / 1024).toFixed(2)}MB`);
            console.log(`  External: ${(avgMemory.external / data.memory.length / 1024 / 1024).toFixed(2)}MB`);

            if (data.times.length > 1) {
                const sortedTimes = [...data.times].sort((a, b) => a - b);
                console.log('Performance Distribution:');
                console.log(`  P50: ${sortedTimes[Math.floor(sortedTimes.length * 0.5)].toFixed(2)}ms`);
                console.log(`  P90: ${sortedTimes[Math.floor(sortedTimes.length * 0.9)].toFixed(2)}ms`);
            }
        });

        console.log('\nPDFs have been generated in the "output" directory under each package name.');
    }
}

// Run benchmark
const benchmark = new EnhancedPDFBenchmark();
benchmark.benchmark(3)
    .catch(console.error);
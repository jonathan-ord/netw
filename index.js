// Jonathan Ordóñez - 2024

import color from 'picocolors';
import readline from 'readline';

// Create the interface to ask the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to count the number of hosts based on the binary network mask
const countHosts = (mask) => {
    let maxHost = 0;
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === '0') {
            maxHost++;
        }
    }
    return 2 ** maxHost;
}

// Function to validate a binary octet
const validateBinaryOctet = (binaryOctet, index) => {
    const octetRegex = /^(1+|0+|1+0+)$/;
    if (!octetRegex.test(binaryOctet)) {
        console.log(color.bgRed(`The octet ${index + 1} does not comply with the specified format.`));
        return false;
    }
    return true;
}

// Function to show the network mask in binary format and validate it
const showMask = (maskDecimal) => {
    let maskVerify = true;
    const mask = maskDecimal.split('.');
    let maskBin = '';

    mask.forEach((element, index) => {
        let binaryOctet = parseInt(element).toString(2).padStart(8, '0');
        if (!validateBinaryOctet(binaryOctet, index)) {
            maskVerify = false;
        }
        maskBin += binaryOctet + '.';
    });

    maskBin = maskBin.slice(0, -1);
    const prefixLength = mask.reduce((acc, val) => acc + parseInt(val).toString(2).split('1').length - 1, 0);

    return {
        maskBin: maskVerify ? maskBin : null,
        prefixLength: maskVerify ? prefixLength : null
    };
}

// Function to determine if an IP is valid
const isValidIP = (ip) => {
    const octets = ip.split('.');
    if (octets.length !== 4) return false;
    for (let i = 0; i < octets.length; i++) {
        const octet = parseInt(octets[i]);
        if (isNaN(octet) || octet < 0 || octet > 255) {
            return false;
        }
    }
    return true;
}

// Function to get the class of a public IP
const getIPClass = (ip) => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) {
        return 'A';
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        return 'B';
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        return 'C';
    } else if (firstOctet >= 224 && firstOctet <= 239) {
        return 'D';
    } else if (firstOctet >= 240 && firstOctet <= 255) {
        return 'E';
    } else {
        return 'Invalid';
    }
}

// Function to get the class of a private IP
const getIPClassPrivate = (ip) => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet === 10) {
        return 'A';
    } else if (firstOctet === 172) {
        const secondOctet = parseInt(ip.split('.')[1]);
        if (secondOctet >= 16 && secondOctet <= 31) {
            return 'B';
        }
    } else if (firstOctet === 192) {
        const secondOctet = parseInt(ip.split('.')[1]);
        if (secondOctet === 168) {
            return 'C';
        }
    }
    return 'Not a private IP';
}

// Function to analyze the IP
const analyzeIP = (ip) => {
    if (!isValidIP(ip)) {
        return 'The IP is not valid';
    }

    const privateClass = getIPClassPrivate(ip);
    if (privateClass !== 'Not a private IP') {
        return `Private IP, class ${privateClass}`;
    } else {
        const publicClass = getIPClass(ip);
        return `Public IP, class ${publicClass}`;
    }
}

// Function to show network mask details
const showDetail = (mask) => {
    const maskBinResult = showMask(mask);

    if (maskBinResult.maskBin && maskBinResult.prefixLength && maskBinResult.maskBin.split('.').length === 4) {
        console.log(color.yellow(`Binary:`), `${maskBinResult.maskBin}`);
        console.log(color.yellow(`Prefix:`), `/ ${maskBinResult.prefixLength}`);
        console.log(color.yellow(`Total hosts:`), `${countHosts(maskBinResult.maskBin)}`);
        console.log(color.yellow(`Valid hosts:`), `${countHosts(maskBinResult.maskBin) - 2}`);
    } else {
        console.log(color.bgRed('Invalid network mask format.'));
    }
}

// Function to convert decimal to binary
const decimalToBinary = (decimal) => {
    let binary = '';
    for (let i = 0; i < decimal.length; i++) {
        binary += parseInt(decimal[i]).toString(2).padStart(8, '0') + '.';
    }
    return binary.slice(0, -1);
}

// Function to convert binary to decimal
const binaryToDecimal = (binary) => {
    let decimal = '';
    const octets = binary.split('.');
    for (let i = 0; i < octets.length; i++) {
        decimal += parseInt(octets[i], 2) + '.';
    }
    return decimal.slice(0, -1);
}

// Function to convert prefix to binary mask
const prefixToBinaryMask = (prefix) => {
    let mask = '';
    if (prefix >= 0 && prefix <= 32) {
        for (let i = 0; i < 32; i++) {
            mask += (i < prefix) ? '1' : '0';
            if ((i + 1) % 8 === 0 && i < 31) {
                mask += '.';
            }
        }
    } else {
        return 'Invalid prefix';
    }
    return mask;
}

// Function to increment IP and handle octet carry
const incrementIP = (ip, increment) => {
    let octets = ip.split('.').map(Number);
    let carry = increment;
    for (let i = 3; i >= 0; i--) {
        let sum = octets[i] + carry;
        octets[i] = sum % 256;
        carry = Math.floor(sum / 256);
    }
    return octets.join('.');
}

// Function to handle subnet calculation
const subnet = (ip, subnetCount, defaultMask) => {
    if (!isValidIP(ip)) {
        return 'The IP is not valid';
    }

    let validate = false;
    let bitAdd = 0;
    while (!validate) {
        let m = 0;
        let result = 0;
        while (result < subnetCount) {
            result = Math.pow(2, m);
            bitAdd = m;
            m++;
        }
        m--;
        if (result >= subnetCount) {
            validate = true;
        }
    }

    let mask = prefixToBinaryMask(defaultMask);
    let maxChange = bitAdd;
    let newMask = mask.split('').map(char => {
        if (char === '0' && maxChange > 0) {
            maxChange--;
            return '1';
        }
        return char;
    }).join('');

    let maskDecimal = newMask.split('.').map(octet => parseInt(octet, 2)).join('.');
    const newPrefix = showMask(maskDecimal).prefixLength;
    const networkJump = Math.pow(2, 32 - newPrefix);

    console.log(color.yellow('\n.- New Prefix ----- ') + '/' + newPrefix);
    console.log(color.yellow('.- New Mask ------- ') + maskDecimal);
    console.log(color.yellow('.- Network Jump --- ') + (networkJump - 2));

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                         Subnet Table                              ║');
    console.log('╠════════════════╦════════════════╦════════════════╦════════════════╣');
    console.log('║ Subnet         ║ First          ║ Last           ║ Broadcast      ║');
    console.log('╠════════════════╬════════════════╬════════════════╬════════════════╣');

    let currentIP = ip;
    for (let i = 0; i < subnetCount; i++) {
        let subnet = currentIP;
        let firstUsable = incrementIP(currentIP, 1);
        let lastUsable = incrementIP(currentIP, networkJump - 2);
        let broadcast = incrementIP(currentIP, networkJump - 1);

        console.log(`║ ${subnet.padEnd(14)} ║ ${firstUsable.padEnd(14)} ║ ${lastUsable.padEnd(14)} ║ ${broadcast.padEnd(14)} ║`);

        currentIP = incrementIP(currentIP, networkJump);
    }

    console.log('╚═══════════════════════════════════════════════════════════════════╝');
}

// Function to display the menu
const showMenu = () => {
    console

.clear();
 
    console.log(color.yellow('╔═══════════════════════════╗'));                             
    console.log(color.yellow('║    ') + color.bold('      🖧 Netw  '), color.yellow('        ║'));
    console.log(color.yellow('╠═══════════════════════════╣'));
    console.log(color.yellow('║ ') + color.cyan('1. ') + 'Network Mask' , color.yellow('          ║'));
    console.log(color.yellow('║ ') + color.cyan('2. ') + 'Verify IP', color.yellow('             ║'));
    console.log(color.yellow('║ ') + color.cyan('3. ') + 'Decimal to Binary', color.yellow('     ║'));
    console.log(color.yellow('║ ') + color.cyan('4. ') + 'Binario - Decimal', color.yellow('     ║'));
    console.log(color.yellow('║ ') + color.cyan('5. ') + 'Prefix to Mask', color.yellow('        ║'));
    console.log(color.yellow('║ ') + color.cyan('6. ') + 'Subnet', color.yellow('                ║'));
    console.log(color.yellow('║ ') + color.cyan('x. ') + 'Exit', color.yellow('                  ║'));
    console.log(color.yellow('╚═══════════════════════════╝'));
}

// Function to handle menu options
const handleOption = (option) => {
    switch (option) {
        case '1':
            rl.question('/nEnter the network mask in decimal format (255.255.255.0): ', (mask) => {
                console.log('');
                showDetail(mask);
                rl.question('\n> Press Enter to continue...', () => {
                    start();
                });
            });
            break;
        case '2':
            rl.question('\nEnter the IP address: ', (ip) => {
                console.log('');
                const result = analyzeIP(ip);
                console.log(color.yellow(result));
                rl.question('\n> Press Enter to continue...', () => {
                    start();
                });
            });
            break;
        case '3':
            rl.question('\nEnter the decimal IP address: ', (decimal) => {
                console.log('');
                const binary = decimalToBinary(decimal.split('.'));
                console.log(color.yellow('Binary:'), binary);
                rl.question('\n> Press Enter to continue...', () => {
                    start();
                });
            });
            break;
        case '4':
            rl.question('\nEnter the binary IP address: ', (binary) => {
                console.log('');
                const decimal = binaryToDecimal(binary);
                console.log(color.yellow('Decimal:'), decimal);
                rl.question('\n> Press Enter to continue...', () => {
                    start();
                });
            });
            break;
        case '5':
            rl.question('\nEnter the prefix length (24): ', (prefix) => {
                console.log('');
                const mask = prefixToBinaryMask(parseInt(prefix));
                console.log(color.yellow('Binary Mask:'), mask);
                console.log(color.yellow('Decimal Mask:'), binaryToDecimal(mask));
                rl.question('\n> Press Enter to continue...', () => {
                    start();
                });
            });
            break;
        case '6':
            rl.question('\nEnter the IP address: ', (ip) => {
                rl.question('Enter the number of subnets: ', (subnetCount) => {
                    rl.question('Enter the default mask length (24): ', (defaultMask) => {
                        console.log('');
                        subnet(ip, parseInt(subnetCount), parseInt(defaultMask));
                        rl.question('\n> Press Enter to continue...', () => {
                            start();
                        });
                    });
                });
            });
            break;
        case 'x':
            rl.close();
            break;
        default:
            console.log(color.red('\nInvalid option, please try again.'));
            start();
            break;
    }
}

// Function to start the application
const start = () => {
    showMenu();
    rl.question('Choose an option: ', (option) => {
        handleOption(option);
    });
}

// Start the application
start();

# 🖧 Netw - Herramienta de Subnetting

[![net.jpg](https://i.postimg.cc/7YzdsWHg/net.jpg)](https://postimg.cc/w76w3Fsv)

## 📜 Descripción

Netw es una herramienta interactiva desarrollada en Node.js para realizar cálculos de subredes, validación de IPs, y conversiones entre formatos binarios y decimales. Esta aplicación facilita el manejo de redes y subredes de una manera sencilla y rápida.

## 📑 Índice

- [📥 Instalación](#instalación)
- [🔧 Uso](#uso)
  - [🔍 Máscara de Red](#máscara-de-red)
  - [✔️ Verificación de IP](#verificación-de-ip)
  - [🔢 Conversión Decimal a Binario](#conversión-decimal-a-binario)
  - [🔄 Conversión Binario a Decimal](#conversión-binario-a-decimal)
  - [📏 Prefijo a Máscara](#prefijo-a-máscara)
  - [📊 Cálculo de Subredes](#cálculo-de-subredes)
- [👤 Autor](#autor)

## 📥 Instalación

Para empezar a utilizar esta herramienta, sigue estos pasos:

1. Clona este repositorio:

   ```sh
   git clone https://github.com/jonathan-ord/netw.git
   ```

2. Navega al directorio del proyecto:

   ```sh
   cd netw
   ```

3. Instala las dependencias necesarias:

   ```sh
   npm install
   ```

4. Inicia la aplicación:

   ```sh
   npm run dev
   ```

## 🔧 Uso

### Menú Principal

Al iniciar la aplicación, verás el siguiente menú interactivo:

🖧 Netw

1.  Máscara de Red
2.  Verificar IP
3.  Decimal a Binario
4.  Binario a Decimal
5.  Prefijo a Máscara
6.  Subneteo
    x. Salir

#### 🔍 Máscara de Red

Esta opción permite ingresar una máscara de red en formato decimal y obtener detalles como la máscara en binario, el prefijo y el número de hosts.

#### ✔️ Verificación de IP

Verifica si una IP es válida y determina su clase (A, B, C, etc.), tanto para IPs públicas como privadas.

#### 🔢 Conversión Decimal a Binario

Convierte una dirección IP en formato decimal a su representación binaria.

#### 🔄 Conversión Binario a Decimal

Convierte una dirección IP en formato binario a su representación decimal.

#### 📏 Prefijo a Máscara

Convierte un prefijo de red (por ejemplo, /24) a su máscara de red en formato binario y decimal.

#### 📊 Cálculo de Subredes

Calcula las subredes para una IP dada, el número de subredes y la máscara por defecto.

El resultado incluirá la tabla de subredes con la primera y última dirección usable y la dirección de broadcast.

## 👤 Autor

- [**Jonathan Ordóñez**](https://github.com/jonathan-ord)

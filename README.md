# React Invoice PDF Generator

This project is a React application that allows users to dynamically create and generate invoices. Users can input vendor details and item information, and then generate a PDF that reflects this data.

## Features

*   **Vendor Information Input:**
    *   Form fields for entering vendor name, address, pin code, contact person, and contact person's mobile number.
    *   Real-time updates of the PDF based on form input.
*   **Item Details Input:**
    *   Table for entering item name, quantity, UOM (Unit of Measurement), and unit price.
    *   Automatic calculation of the total price per item based on quantity and unit price.
    *   Dynamically add or remove items from the table.
*   **PDF Generation:**
    *   Generates a professional-looking PDF document with vendor details, item details, and basic formatting.
    * Includes header with RFQ details, Date, and page numbering.
    *   Includes a closing signature and company name.
    *   Saves the PDF file locally.
    * open the pdf in new tab
* **Dynamic Data**
    * Data entered in the forms is reflected in the PDF, making the document highly customizable.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **jsPDF:** A library for generating PDF documents in JavaScript.
*   **jsPDF-AutoTable:** An extension for jsPDF to create table layouts in the PDF.
*   **date-fns:** A utility library for date formatting.
* **React Hooks** (`useState`): Used for state management.

## Installation and Usage

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
    Replace `https://github.com/micrometre/react-invoice` and `react-invoice` with your actual repository URL and folder name.
2.  **Install Dependencies:**
    ```bash
    npm install  # or yarn install
    ```
3.  **Start the Development Server:**
    ```bash
    npm run dev # or yarn dev
    ```
    This will start the development server, and you can access the application in your browser (usually at `http://localhost:5173/`).

## Project Structure


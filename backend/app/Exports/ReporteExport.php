<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ReporteExport implements FromArray, WithHeadings, WithColumnFormatting
{
    protected $data;
    protected $headings;
    protected $selectedColumns;

    public function __construct(array $data, array $headings, array $selectedColumns)
    {
        $this->data = $data;
        $this->headings = $headings;
        $this->selectedColumns = $selectedColumns;
    }

    public function array(): array
    {
        return array_map(function ($row) {
            $row = array_replace(array_flip($this->selectedColumns), array_intersect_key($row, array_flip($this->selectedColumns)));

            // if (isset($row['datetime_created']) && $row['datetime_created']) {
            //     try {
            //         $formattedDate = Carbon::createFromFormat('d/m/Y', $row['datetime_created']);
            //         $row['datetime_created'] = Date::PHPToExcel(Carbon::parse($formattedDate));
            //     } catch (\Throwable $th) {
            //         $formattedDate = Carbon::createFromFormat('Y-m-d', $row['datetime_created'])->format('d/m/Y');
            //         $row['datetime_created'] = Date::PHPToExcel(Carbon::parse($formattedDate));
            //     }
            // }

            return $row;
        }, $this->data);
    }

    public function columnFormats(): array
    {
        $index = array_search('datetime_created', $this->selectedColumns); // obtener índice de la columna
        if ($index === false) return [];

        // Convertir índice numérico a letra de columna de Excel (A, B, C...)
        $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);

        return [
            $columnLetter => NumberFormat::FORMAT_DATE_DDMMYYYY,
        ];
    }

    public function headings(): array
    {
        return $this->headings;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->string('photo_path')->nullable()->after('notes');
        });

        Schema::table('pets', function (Blueprint $table): void {
            $table->string('photo_path')->nullable()->after('notes');
        });

        Schema::table('veterinarians', function (Blueprint $table): void {
            $table->string('photo_path')->nullable()->after('specialty');
        });

        Schema::table('clinical_records', function (Blueprint $table): void {
            $table->string('attachment_path')->nullable()->after('observations');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->dropColumn('photo_path');
        });

        Schema::table('pets', function (Blueprint $table): void {
            $table->dropColumn('photo_path');
        });

        Schema::table('veterinarians', function (Blueprint $table): void {
            $table->dropColumn('photo_path');
        });

        Schema::table('clinical_records', function (Blueprint $table): void {
            $table->dropColumn('attachment_path');
        });
    }
};

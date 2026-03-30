<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration {
    public function up() {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['admin', 'cajero', 'supervisor']);
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('users');
    }
}

class CreateCashRegistersTable extends Migration {
    public function up() {
        Schema::create('cash_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->decimal('opening_amount', 12, 2);
            $table->decimal('closing_amount', 12, 2)->nullable();
            $table->enum('status', ['abierta', 'cerrada']);
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('cash_registers');
    }
}

class CreateCashMovementsTable extends Migration {
    public function up() {
        Schema::create('cash_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->enum('type', ['incremento', 'disminucion', 'arqueo', 'diferencia', 'retiro', 'deposito']);
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->foreignId('performed_by')->constrained('users');
            $table->unsignedBigInteger('related_account_id')->nullable();
            $table->string('currency', 3);
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('cash_movements');
    }
}

class CreateAccountsTable extends Migration {
    public function up() {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_number')->unique();
            $table->string('client_name');
            $table->enum('type', ['ahorros', 'corriente', 'plazo_fijo', 'tarjeta_credito', 'credito']);
            $table->decimal('balance', 14, 2);
            $table->string('currency', 3);
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('accounts');
    }
}

class CreateTransactionsTable extends Migration {
    public function up() {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->foreignId('account_id')->constrained();
            $table->string('type');
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3);
            $table->string('reference_number')->nullable();
            $table->decimal('exchange_rate', 10, 4)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('transactions');
    }
}

class CreateChequesTable extends Migration {
    public function up() {
        Schema::create('cheques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained();
            $table->string('cheque_number');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['emitido', 'cobrado', 'certificado', 'rechazado']);
            $table->timestamp('certified_at')->nullable();
            $table->timestamp('cashed_at')->nullable();
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('cheques');
    }
}

class CreateCashDifferencesTable extends Migration {
    public function up() {
        Schema::create('cash_differences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->decimal('expected_amount', 14, 2);
            $table->decimal('real_amount', 14, 2);
            $table->decimal('difference', 14, 2);
            $table->text('reason');
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('cash_differences');
    }
}

class CreatePcc01FormsTable extends Migration {
    public function up() {
        Schema::create('pcc01_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->json('data');
            $table->foreignId('submitted_by')->constrained('users');
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('pcc01_forms');
    }
}

class CreateForeignExchangeOperationsTable extends Migration {
    public function up() {
        Schema::create('foreign_exchange_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->enum('type', ['compra', 'venta']);
            $table->decimal('amount_bob', 14, 2);
            $table->decimal('amount_usd', 14, 2);
            $table->decimal('exchange_rate', 10, 4);
            $table->string('client_name');
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('foreign_exchange_operations');
    }
}

class CreateMoneyTransfersTable extends Migration {
    public function up() {
        Schema::create('money_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->enum('type', ['envio', 'pago']);
            $table->string('sender_name');
            $table->string('receiver_name');
            $table->decimal('amount', 14, 2);
            $table->string('reference_code');
            $table->enum('status', ['pendiente', 'pagado']);
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('money_transfers');
    }
}

class CreateServicesPaymentsTable extends Migration {
    public function up() {
        Schema::create('services_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_register_id')->constrained();
            $table->string('service_name');
            $table->string('reference_number');
            $table->decimal('amount', 12, 2);
            $table->string('client_name');
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('services_payments');
    }
}

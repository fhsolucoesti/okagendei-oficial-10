-- Complete system setup with all tables, RLS policies, and functions
-- This migration creates the entire database structure needed for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'company_admin', 'professional');
CREATE TYPE company_status AS ENUM ('active', 'trial', 'suspended', 'cancelled');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE notification_type AS ENUM ('appointment', 'payment', 'system', 'company_registered', 'payment_overdue');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE commission_status AS ENUM ('pending', 'paid');

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'basic',
    status company_status DEFAULT 'trial',
    employees INTEGER DEFAULT 1,
    monthly_revenue DECIMAL(10,2) DEFAULT 0,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    custom_url VARCHAR(100) UNIQUE,
    logo TEXT,
    next_payment TIMESTAMP WITH TIME ZONE,
    overdue_days INTEGER DEFAULT 0,
    whatsapp_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    max_employees VARCHAR(50) NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'professional',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    avatar TEXT,
    must_change_password BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- duration in minutes
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professionals table
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    specialties JSONB DEFAULT '[]'::jsonb,
    commission DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    birth_date DATE,
    total_appointments INTEGER DEFAULT 0,
    last_appointment TIMESTAMP WITH TIME ZONE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    price DECIMAL(10,2) NOT NULL,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Working hours table
CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commissions table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    status commission_status DEFAULT 'pending',
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending',
    description TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    priority notification_priority DEFAULT 'medium',
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percentage DECIMAL(5,2) NOT NULL,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing config table
CREATE TABLE landing_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Super admins can view all companies" ON companies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Company admins can view their own company" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Super admins can insert companies" ON companies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Super admins can update all companies" ON companies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Company admins can update their own company" ON companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

CREATE POLICY "Super admins can delete companies" ON companies
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

-- RLS Policies for plans (public read, super admin write)
CREATE POLICY "Anyone can view active plans" ON plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage plans" ON plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Super admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Company admins can view users from their company" ON users
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid() AND users.role = 'company_admin'
        )
    );

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Super admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

-- RLS Policies for services
CREATE POLICY "Public can view active services for booking" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Company members can manage their services" ON services
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

-- RLS Policies for professionals
CREATE POLICY "Public can view active professionals" ON professionals
    FOR SELECT USING (is_active = true);

CREATE POLICY "Company members can manage their professionals" ON professionals
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

-- RLS Policies for clients
CREATE POLICY "Company members can manage their clients" ON clients
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

-- RLS Policies for appointments
CREATE POLICY "Company members can manage their appointments" ON appointments
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

-- RLS Policies for working_hours
CREATE POLICY "Public can view working hours" ON working_hours
    FOR SELECT USING (true);

CREATE POLICY "Company members can manage working hours" ON working_hours
    FOR INSERT WITH CHECK (
        professional_id IN (
            SELECT p.id FROM professionals p
            JOIN users u ON u.id = auth.uid()
            WHERE p.company_id = u.company_id
        )
    );

CREATE POLICY "Company members can update working hours" ON working_hours
    FOR UPDATE USING (
        professional_id IN (
            SELECT p.id FROM professionals p
            JOIN users u ON u.id = auth.uid()
            WHERE p.company_id = u.company_id
        )
    );

CREATE POLICY "Company members can delete working hours" ON working_hours
    FOR DELETE USING (
        professional_id IN (
            SELECT p.id FROM professionals p
            JOIN users u ON u.id = auth.uid()
            WHERE p.company_id = u.company_id
        )
    );

-- RLS Policies for commissions
CREATE POLICY "Company members can view their commissions" ON commissions
    FOR SELECT USING (
        professional_id IN (
            SELECT p.id FROM professionals p
            JOIN users u ON u.id = auth.uid()
            WHERE p.company_id = u.company_id
        )
    );

CREATE POLICY "Company admins can manage commissions" ON commissions
    FOR ALL USING (
        professional_id IN (
            SELECT p.id FROM professionals p
            JOIN users u ON u.id = auth.uid()
            WHERE p.company_id = u.company_id AND u.role = 'company_admin'
        )
    );

-- RLS Policies for expenses
CREATE POLICY "Company members can manage their expenses" ON expenses
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

-- RLS Policies for invoices
CREATE POLICY "Company members can manage their invoices" ON invoices
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        )
    );

-- RLS Policies for notifications
CREATE POLICY "Company members can view their notifications" ON notifications
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        ) OR company_id IS NULL
    );

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notification read status" ON notifications
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM users WHERE users.id = auth.uid()
        ) OR company_id IS NULL
    );

-- RLS Policies for coupons
CREATE POLICY "Super admins can manage coupons" ON coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Anyone can view active coupons" ON coupons
    FOR SELECT USING (is_active = true);

-- RLS Policies for landing_config
CREATE POLICY "Super admins can manage landing config" ON landing_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY "Anyone can view landing config" ON landing_config
    FOR SELECT USING (true);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_working_hours_updated_at BEFORE UPDATE ON working_hours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_config_updated_at BEFORE UPDATE ON landing_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'professional')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage buckets and policies
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('company-logos', 'company-logos', true),
    ('service-images', 'service-images', true);

-- Storage policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view company logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Company members can upload company logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'company-logos' AND
        EXISTS (
            SELECT 1 FROM users u
            JOIN companies c ON u.company_id = c.id
            WHERE u.id = auth.uid() AND c.id::text = (storage.foldername(name))[1]
        )
    );

CREATE POLICY "Anyone can view service images" ON storage.objects
    FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Company members can upload service images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'service-images' AND
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() AND u.company_id::text = (storage.foldername(name))[1]
        )
    );

-- Seed data
INSERT INTO plans (name, max_employees, monthly_price, yearly_price, features, is_popular) VALUES
    ('Básico', '5', 49.90, 499.00, '["Agendamento online", "Controle de clientes", "Relatórios básicos"]', false),
    ('Profissional', '15', 99.90, 999.00, '["Agendamento online", "Controle de clientes", "Relatórios avançados", "WhatsApp integrado", "Comissões"]', true),
    ('Empresarial', 'Ilimitado', 199.90, 1999.00, '["Todas as funcionalidades", "Múltiplas filiais", "API personalizada", "Suporte prioritário"]', false);

-- Initial landing config
INSERT INTO landing_config (config) VALUES ('{
    "hero": {
        "title": "Transforme seu negócio com agendamento inteligente",
        "subtitle": "A plataforma completa para gerenciar sua barbearia, salão ou clínica com eficiência e profissionalismo.",
        "ctaText": "Começar Gratuitamente"
    },
    "features": [
        {
            "title": "Agendamento Online",
            "description": "Permita que seus clientes agendem 24/7 através de um link personalizado",
            "icon": "calendar"
        },
        {
            "title": "Gestão Completa",
            "description": "Controle clientes, serviços, profissionais e finanças em um só lugar",
            "icon": "users"
        },
        {
            "title": "Relatórios Avançados",
            "description": "Acompanhe o crescimento do seu negócio com relatórios detalhados",
            "icon": "chart"
        }
    ]
}');

-- Create indexes for better performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_company_id ON appointments(company_id);
CREATE INDEX idx_appointments_date_time ON appointments(date_time);
CREATE INDEX idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_services_company_id ON services(company_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_professionals_company_id ON professionals(company_id);
CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_notifications_company_id ON notifications(company_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
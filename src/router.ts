import { FastifyInstance } from "fastify";
import { CreateUser, CreateDev, Login } from "./interfaces/user";
import { UserServices } from "./services/user";
import { BarbershopServices } from "./services/barbershop";
import { CreateBarbershop } from "./interfaces/barbershop";
import { ProductServices } from "./services/product";
import { CreateProduct } from "./interfaces/product";
import { AuthMiddleware } from "./middleware/middleware";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

const userServices = new UserServices();
const barbershopServices = new BarbershopServices();
const productServices = new ProductServices();

// public rotes
export const publicRotes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: Login }>("/signin", async (req, reply) => {
    const result = await userServices.sigin({
      email: req.body.email,
      password: req.body.password,
    });

    if (!result)
      return reply.code(400).send({ error: "usuário não encontrado" });

    if (!result.user) return reply.code(400).send({ error: "senha incorreta" });

    return reply
      .code(200)
      .send({ message: "usuário logado com sucesso", result });
  });

  fastify.post("/logout", (req, reply) => {
    return reply.code(200).send("usuário deslogado");
  });
};

//rotas dev
export const devRotes = async (fastify: FastifyInstance) => {
  //cria um dev novo
  fastify.post<{ Body: CreateDev }>("/", async (req, reply) => {
    const result = await userServices.create(req.body);

    if (!result) return reply.code(400).send({ error: "usuário já existe" });

    return reply
      .code(201)
      .send({ message: "usuário criado com sucesso", result });
  });
  //dev cria uma barbearia
  fastify.post<{ Body: CreateBarbershop }>(
    "/createBarbeshop",
    async (req, reply) => {
      const result = await barbershopServices.create(req.body.name);

      if (!result)
        return reply.code(500).send({ message: "Erro ao criar a barbearia" });

      return reply
        .code(201)
        .send({ message: "barbearia criada com sucesso", result });
    }
  );

  //dev cria uma unidade
  fastify.post("/createUnit", async (req, reply) => {
    return reply.code(201).send("unidade criada com sucesso");
  });

  //dev cria um usuário
  fastify.post<{ Body: CreateUser }>("/createUser", async (req, reply) => {
    const result = await userServices.create(req.body);

    if (!result) return reply.code(400).send({ error: "usuário já existe" });

    return reply
      .code(201)
      .send({ message: "usuário criado com sucesso", result });
  });

  //cria um produto
  fastify.post<{ Body: CreateProduct }>(
    "/createProduct",
    async (req, reply) => {
      const result = await productServices.create(req.body);

      if (!result)
        return reply.code(500).send({ message: "Erro, usuário não criado" });

      return reply
        .code(201)
        .send({ message: "Produco criado com sucesso", result });
    }
  );

  //mostra todos os usuários
  fastify.get("/", async (req, reply) => {
    const result = await userServices.getAllUsers();

    if (!result)
      return reply.code(404).send({ message: "Nenhum usuário encontrado" });

    return reply
      .code(200)
      .send({ message: "Usuários encontrados", users: result });
  });

  //mostra um usuário pelo id
  fastify.get<{ Params: { id: string } }>("/user/:id", async (req, reply) => {
    const result = await userServices.findUser(req.params.id);

    if (!result)
      return reply.code(404).send({ message: "Usuário não encontrado" });

    console.log(result);
    return reply
      .code(200)
      .send({ message: "usuário encontrado", user: result });
  });

  //procura usuários pelo nome
  fastify.get<{ Params: { value: string } }>(
    "/user/name/:value",
    async (req, reply) => {
      const result = await userServices.findUsersByName(req.params.value);

      if (!result)
        return reply.code(404).send({ message: "Nenhum usuário encontrado" });

      return reply
        .code(200)
        .send({ message: "Usuários encontrados", users: result });
    }
  );

  //mostra todas as barbearias
  fastify.get("/barbeshop", async (req, reply) => {
    const result = await barbershopServices.getAll();

    if (!result)
      return reply.code(404).send({ message: "Nenhum usuário encontrado" });

    return reply.code(200).send({ message: "barbearias encontradas", result });
  });

  //mostra uma barbearia
  fastify.get<{ Params: { id: string } }>(
    "/barbershop/:id",
    async (req, reply) => {
      const result = await barbershopServices.getById(req.params.id);

      if (!result)
        return reply
          .code(404)
          .send({ message: "Nenhuma barbearia encontrada" });

      return reply.code(200).send({ message: "barbearia encontrada", result });
    }
  );

  //procura por uma barbearia de acordo com seu nome
  fastify.get<{ Params: { name: string } }>(
    "/barbershop/find/:name",
    async (req, reply) => {
      const result = await barbershopServices.find(req.params.name);

      if (!result)
        return reply
          .code(404)
          .send({ massage: "Nenhuma barbearia encontrada" });

      return reply
        .code(200)
        .send({ message: "Barbearias encontradas", result });
    }
  );

  //mostra unidades de uma barbearia
  fastify.get("/barbershop/:id/unit/", (req, reply) => {
    return reply.code(200).send("unidades encontradas");
  });

  //mostra uma unidade de uma barbearia
  fastify.get("/barbershop/:barberShopid/unit/:unitId", (req, reply) => {
    return reply.code(200).send("unidade encontrada");
  });

  //mostra todos os barbeiros de uma barbearia
  fastify.get<{ Params: { id: string } }>(
    "/barbershop/:id/employees",
    async (req, reply) => {
      const result = await barbershopServices.getEmployees(req.params.id);

      if (!result)
        return reply.code(404).send({ message: "Nenhum barbeiro encontrado" });

      return reply.code(200).send({ message: "barbeiros encontrados", result });
    }
  );

  //deleta uma barbearia
  fastify.delete<{ Params: { id: string } }>(
    "/barbershop/:id",
    async (req, reply) => {
      const result = await barbershopServices.delete(req.params.id);

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro ao tentar deletar barbearia" });

      return reply
        .code(200)
        .send({ message: "Barbearia deletada com sucesso", result });
    }
  );
};

//CRUD Usuário
export const userRotes = async (fastify: FastifyInstance) => {
  // fastify.addHook("onRequest", AuthMiddleware);

  //um usuário cria um novo usuário
  fastify.post<{ Body: CreateUser }>("/:id/employees/", async (req, reply) => {
    const result = await userServices.createEmployee(req.body);

    if (!result)
      return reply.code(500).send({ message: "erro ao criar usuário" });

    return reply.code(201).send({ message: "criado com sucesso", result });
  });

  //retorna todos os funcionarios daquele barbeiro
  fastify.get<{ Params: { id: string } }>(
    "/:id/employees/",
    async (req, reply) => {
      const result = await userServices.findEmployees(req.params.id);

      if (!result)
        return reply.code(404).send({ message: "Nenhum usuário encontrado" });

      return reply.code(200).send({ message: "Usuários encontrados", result });
    }
  );

  //retorna um unico usuário
  fastify.get("/:id/employees/:employeeId", (req, reply) => {
    return reply.code(200).send("Usuário encontrado");
  });

  //retorna comissão do usuário
  fastify.get("/:id/commission", (req, reply) => {
    return reply.code(200).send("comissão encontrada");
  });

  //edita celular do usuário
  fastify.patch<{ Body: { value: string }; Params: { id: string } }>(
    "/:id/cellphone",
    async (req, reply) => {
      const data = { id: req.params.id, value: req.body.value };
      const result = await userServices.updateCellphone(data);

      if (!result)
        return reply
          .code(500)
          .send({ message: "Falha ao alterar número do celular" });

      return reply.code(200).send({
        message: "Número de celular alterado com sucesso",
        user: result,
      });
    }
  );

  //edita a senha do usuário
  fastify.patch<{ Body: { value: string }; Params: { id: string } }>(
    "/:id/password",
    async (req, reply) => {
      const data = { id: req.params.id, value: req.body.value };
      const result = await userServices.updatePassword(data);

      if (!result)
        return reply
          .code(500)
          .send({ messsage: "Falha ao alterar o número do celular" });

      return reply
        .code(200)
        .send({ message: "Senha alterada com sucesso", user: result });
    }
  );

  //um usuário deleta o proprio perfil
  fastify.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const result = await userServices.delete(req.params.id);

    if (!result)
      return reply.code(500).send({ message: "Falha ao deletar usário" });

    return reply
      .code(200)
      .send({ message: "Usuário deletado com sucesso", user: result });
  });

  //um usuário deleta outro usuário
  fastify.delete<{ Params: { id: string; employeeId: string } }>(
    "/:id/employee/:employeeId",
    async (req, reply) => {
      const result = await userServices.deleteEmployee({
        userId: req.params.id,
        employeeId: req.params.employeeId,
      });

      if (!result)
        return reply.code(500).send({ message: "Erro ao deletar usuário" });

      return reply
        .code(200)
        .send({ message: "Colaborador deletado com sucesso", result });
    }
  );
};

export const barbershopRotes = async (fastify: FastifyInstance) => {
  // cria produtos da barbearia
  fastify.post("/createProducts", (req, reply) => {
    return reply.code(201).send("produto criado com sucesso");
  });

  //cria um procedimento
  fastify.post("/createProcess", (req, reply) => {
    return reply.code(201).send("procedimento cridado com sucesso");
  });

  //usuário cria uma nova unidade
  fastify.post("/createUnit", (req, reply) => {
    return reply.code(201).send("unidade criado com sucesso");
  });

  //mostra todos os produtos
  fastify.get("/products", (req, reply) => {
    return reply.code(200).send("produtos encontrados");
  });

  //mostra um produto
  fastify.get("/products/:produtctId", (req, reply) => {
    return reply.code(200).send("produto encontrado");
  });

  //mostra todos os procedimentos
  fastify.get("/process", (req, reply) => {
    return reply.code(200).send("procedimentos encontrados");
  });

  //mostra um procedimento
  fastify.get("/process/:processId", (req, reply) => {
    return reply.code(200).send("procedimento encontrado");
  });

  //mostra todas as unidades da barbearia
  fastify.get("/units", (req, reply) => {
    return reply.code(200).send("unidades encontradas");
  });

  //mostra uma unidade da barbearia
  fastify.get("/units/:unitId", (req, reply) => {
    return reply.code(200).send("unidade encontrada");
  });

  //mostra o caixa de todas as unidades
  fastify.get("/cash", (req, reply) => {
    return reply.code(200).send("caixas encontrados");
  });
};

export const productsRotes = async (fastify: FastifyInstance) => {
  fastify.patch<{ Body: { id: string; value: string } }>(
    "/name",
    async (req, reply) => {
      const result = await productServices.updateName({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro, atualização mal sucedida" });

      return reply.code(200).send({ message: "editado com sucesso", result });
    }
  );

  fastify.patch<{ Body: { id: string; value: number } }>(
    "/weight",
    async (req, reply) => {
      const result = await productServices.updateWeight({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro, atualização mal sucedida" });

      return reply.code(200).send({ message: "editado com sucesso", result });
    }
  );

  fastify.patch<{ Body: { id: string; value: string } }>(
    "/nameWeight",
    async (req, reply) => {
      const result = await productServices.updateNameWeight({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro, atualização mal sucedida" });

      return reply.code(200).send({ messaege: "editado com sucesso", result });
    }
  );

  fastify.patch<{ Body: { id: string; value: number } }>(
    "/cost",
    async (req, reply) => {
      const result = await productServices.updateCost({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Eroo, atualização mal sucedida" });

      return reply.code(200).send({ message: "editado com sucesso", result });
    }
  );

  fastify.patch<{ Body: { id: string; value: number } }>(
    "/price",
    async (req, reply) => {
      const result = await productServices.updatePrice({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro, atualização mal sucedida" });

      return reply.code(200).send({ message: "editado com sucesso", result });
    }
  );

  fastify.patch<{ Body: { id: string; value: string } }>(
    "/describe",
    async (req, reply) => {
      const result = await productServices.updateDescribe({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro, atualização mal sucedida" });

      return reply.code(200).send({ message: "editado com sucesso", result });
    }
  );

  fastify.patch<{ Body: { id: string; value: boolean } }>(
    "/workTop",
    async (req, reply) => {
      const result = await productServices.updateWorktop({
        id: req.body.id,
        value: req.body.value,
      });

      if (!result)
        return reply
          .code(500)
          .send({ message: "Erro, atualização mal sucedida" });

      return reply.code(200).send({ message: "editado com sucesso", result });
    }
  );
};

export const processRotes = async (fastify: FastifyInstance) => {
  fastify.patch("/name", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  fastify.patch("/cost", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  fastify.patch("/price", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  fastify.patch("/category", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  fastify.patch("/type", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });
};

export const categoryRotes = async (fastify: FastifyInstance) => {
  fastify.post("/createCatagory", (req, reply) => {
    return reply.code(201).send("criado com sucesso");
  });

  fastify.get("/", (req, reply) => {
    return reply.code(200).send("categorias encontradas");
  });

  fastify.patch("/:id/name", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  fastify.delete("/:id", (req, reply) => {
    return reply.code(200).send("deletado com sucesso");
  });
};

export const typeRotes = async (fastify: FastifyInstance) => {
  fastify.post("/createType", (req, reply) => {
    return reply.code(201).send("criado com sucesso");
  });

  fastify.get("/", (req, reply) => {
    return reply.code(200).send("categorias encontradas");
  });

  fastify.patch("/:id/name", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  fastify.delete("/:id", (req, reply) => {
    return reply.code(200).send("deletado com sucesso");
  });
};

export const unitsRotes = async (fastify: FastifyInstance) => {
  //registra um produto em uma unidade
  fastify.post("/registerProducts/:id", (req, reply) => {
    return reply.code(201).send("produto registrado");
  });

  //registra um procedimento em uma unidade
  fastify.post("/registerProcess/:id", (req, reply) => {
    return reply.code(201).send("procedimento registrado com sucesso");
  });

  //registra uma despesa em uma unidade
  fastify.post("/expenses", (req, reply) => {
    return reply.code(201).send("despesas cadastrada com sucesso");
  });

  //mostra todos os produtos de uma unidade
  fastify.get("/products", (req, reply) => {
    return reply.code(200).send("produtos encontrados");
  });

  //mostra um produto da unidade e seu estoque
  fastify.get("/products/:id", (req, reply) => {
    return reply.code(200).send("produto encontrado");
  });

  //mostra todos os procedimentos de uma unidade
  fastify.get("/process", (req, reply) => {
    return reply.code(200).send("procedimentos encontrados");
  });

  //mostra um procedimento da unidade
  fastify.get("/process/:id", (req, reply) => {
    return reply.code(200).send("procedimento encontrado");
  });

  //mostra o estoque daquela unidade
  fastify.get("/stock", (req, reply) => {
    return reply.code(200).send("estoque encontrado com sucesso");
  });

  //mostra todas as movimentações no estoque
  fastify.get("/stock/movements", (req, reply) => {
    return reply.code(200).send("movimentações no estoque");
  });

  // mostra o caixa da unidade
  fastify.get("/cash", (req, reply) => {
    return reply.code(200).send("caixa encontrado");
  });

  //mostra as despesas da unidade
  fastify.get("/expenses", (req, reply) => {
    return reply.code(200).send("despesas encontradas");
  });

  //mostra todos os funcionarios de uma unidade
  fastify.get("/employee", (req, reply) => {
    return reply.code(200).send("barbeiros encontrados");
  });
};

export const stockRotes = async (fastify: FastifyInstance) => {
  //registra a entrada de estoque
  fastify.post("/in", (req, reply) => {
    return reply.code(201).send("entrada cadastrada com sucesso");
  });

  //registra a saída de estoque
  fastify.post("/out", (req, reply) => {
    return reply.code(201).send("saída cadastrada com sucesso");
  });

  //mostra estoque do produto
  fastify.get("/", (req, reply) => {
    return reply.code(200).send("estoque encontrado");
  });
  //mostra todas as movimentações de um estoque
  fastify.get("/movements", (req, reply) => {
    return reply.code(200).send("movimentações deste produtos");
  });
};

export const cashRotes = async (fastify: FastifyInstance) => {
  //registra a entrada de dinheiro
  fastify.post("/in", (req, reply) => {
    return reply.code(201).send("entrada cadastrada com sucesso");
  });

  //registra a saída de dinheiro
  fastify.post("/out", (req, reply) => {
    return reply.code(201).send("saída cadastrada com sucesso");
  });

  //mostra as movimetações daquele caixa
  fastify.get("/movements", (req, reply) => {
    return reply.code(200).send("movimentações encontradas");
  });
};

export const expensesRotes = async (fastify: FastifyInstance) => {
  //edita o nome da despesa
  fastify.patch("/name", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  //edita o icone da despesa
  fastify.patch("/icon", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  //edita a data de vencimento da despesa
  fastify.patch("/date", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });

  //edita o valor da despesa
  fastify.patch("/price", (req, reply) => {
    return reply.code(200).send("editado com sucesso");
  });
};

export const serviceRotes = async (fastify: FastifyInstance) => {
  fastify.post("/createService", (req, reply) => {
    return reply.code(201).send("criado com sucesso");
  });

  fastify.get("/", (req, reply) => {
    return reply.code(200).send("atendimentos encontrados");
  });

  fastify.get("/:id", (req, reply) => {
    return reply.code(200).send("atendimento encontrado");
  });
};
